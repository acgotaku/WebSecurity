# CSRF防御 #
Web框架与CSRF防御
 ---
 
在Web框架中可以使用security token解决CSRF攻击的问题。     

CSRF攻击的目标，一般都会产生“写数据”操作的URL，比如“增”、“删”、“改”；而“读数据”操作并不是CSRF攻击的目标，因为在CSRF的攻击过程中攻击者无法获取到服务器端返回到数据，攻击值只是借用户之手触发服务器动作，所以读数据对于CSRF来说并无直接的意义。     

因此，在Web应用开发中，有必要对“读操作”和“写操作”予以区分，比如要求所有的“写操作”都是用HTTP POST。     

在很多讲述CSRF防御的文章中，都要求使用HTTP POST进行防御，但实际上POST本身并不足以对抗CSRF，因为POST也是可以自动提交的。但是POST的使用，对于保护token有着积极的意义，而security token的私密性，是防御CSRF攻击的基础。      

对于Web框架来说，可以自动地在所有涉及POST的代码中添加token，这些地方包括所有的from表单，所有的Ajax POST请求等。     

完整的CSRF防御方案，对于Web框架来说有以下几处地方需要改动。   

  1.	在Session中绑定token。如果不能保存到服务器端Session中，则可以替代为保存到Cookie中。    
  1.	在from表单中自动填入token字段，比如`<input type=hidden name="anti_csrf_token" value="$token" />`   
  1.	在Ajax请求中自动添加token。   
  1.	在服务器端对比POST提交参数的token与Session中绑定的token是否一致，已验证CSRF攻击。