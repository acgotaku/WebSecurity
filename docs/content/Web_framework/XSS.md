# XSS防御
模板引擎与XSS防御    

---
## **防御方法** #
在View层，可以解决XSS问题。XSS攻击实在用户的浏览器上执行的。其形成过程则是在服务器端页面渲染时，注入了恶意 的HTML代码导致的。从MVC架构来说，是发生在View层，因此可以使用“**输出编码**”的方式来防御，即针对不同上下文的XSS攻击场景，使用不同的编码方式。    

“输出编码”的防御方法可以总结为以下几种：      

* 在HTML标签中输出变量     
* 在HEML属性中输出变量
* 在script标签中输出变量
* 在事件中输出变量
* 在CSS中输出变量
* 在URL中输出变量   
   
 针对不同的情况，使用不同的编码函数。      
 
 ---
## **Django 与 XSS 防御** #
在当前流行的MVC框架中， View层常用的技术是使用模板引擎对页面进行渲染，比如在Django中就是用了 Django Templates 作为模板引擎。模板引擎本身会提供一些编码方法。比如在 Django Templates 中，使用 filters 中的 escape 作为 HtmlEncode 的方法：    
    
        <h1>hello,  {{ name|escape }}!</h1>    
    
Django Templates 同时支持 auto-escape，符合 Secure by Default 原则。现在的 Django Templates 默认是将 aotu-escape 开启的，所有的变量都会经过 HTMLEncode后输出。默认是编码了5个字符：    
    
        < is converted to &lt;
        > is converted to &gt;
        ' (single queto) is converted to &#39;
        " (double quote) is converted to &quot;
        & is converted to &amp;    
        
如果要关闭 auto-escape，则需要使用以下方法：    
    
        {{ data|safe }}
    
或者    
    
        {% autoescape off %}
            Hello {{ name }}
        {% endautoescape %}
    
为了方便，很多程序员可能会选择关闭 auto-escape。要检查 auto-escape 是否被关闭也很简单，搜索代码里是否出现上面两种情况即可。    

但是如前文所述，最好的XSS防御方案，在不同的场景需要使用不同的编码函数。如果统一使用者5个字符的HTMLEncode， 则很可能会被攻击者绕过。由此看来，这种 auto-escape 的方案也不是很完善。   

---
## **Velocity 与 XSS 防御** #
在模板引擎Velocity中，也提供了类似的机制，但有所不同的是，Velocity 默认是没有开启 HtmlEncode 的。   

在 Velocity 中，可以通过 Event Handler 来进行 HTMLEncode。    
    
        eventhandler.referenceinsertion.class = org.apache.velocity.app.event.implement.
        EscapeHtmlReference
        eventhandler.escape.html.match = /msg.*/
    
使用方法如下，这里同时还加入了一个转义SQL语句的 Event Handler。    
    
        ...
        
        import org.apache.velocity.app.event.EventCartridge;
        import org.apache.velocity.app.event.ReferenceInsertionEventHandler;
        import org.apache.velocity.app.event.implement.EscapeHtmlReference;
        import org.apache.velocity.app.event.implement.EscapeSqlReference;
        
        ...
        
        public class Test
        {
            public void myTest()
            {
                ...
                
                /**
                 * Make a cartridge to hold the event handlers
                 */
                EventCartridge ec = new EventCartridge();
                
                /**
                 * then register and chain two escape-related handlers
                 */
                ec.addEventHandler(new EscapeHtmlReference());
                ec.addEventHandler(new EscapeSqlReference());
                
                 /**
                 * and then finally let it attach itself to the context
                 */
                ec.attachToContext(context);
                
                 /**
                 * now merge your template with the context as you mormally do
                 */
                
                ...
            }
            
        }
    

但 Velocity 提供的处理机制，与 Django 的 auto-escape 所提供的机制是类似的，都只进行了 HTMLEncode，而未细分编码使用的具体场景。不过在模板引擎中，可以实现自定义的编码函数，应用于不同场景。在 Django 中是使用自定义 filters，在 Velocity 中则可以使用“宏”（velocimacro），比如：
    
        XML编码输出，将会执行 XML Encode 输出
        #SXML($xml)
        
        JS编码输出，将会执行JavaScript Encode输出
        #SJS($js)
    
通过自定义的方法，使得XSS防御的功能得到完善；同时在模板系统中，搜索不安全的变量也有了依据，甚至在代码检测工具中，可以自动判断出需要使用那一种安全的编码方式。    

---
## **总结** #
在模板引擎中，可以实现自定义的编码函数，来应用于不同的场景。我们可以依据是否有细分场景使用不同的编码方式来判断XSS的安全方案是否完善。在很多 Web 框架官方文档中推荐的用法，就是存在缺陷的。Web 框架的开发者在设计安全方案时，有时会缺乏来自安全专家的建议。所以开发者在使用框架时，应该慎重对待安全问题。    
