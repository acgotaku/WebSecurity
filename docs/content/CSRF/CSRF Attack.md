##CSRF实验

实验环境：[MIT6.858实验](http://css.csail.mit.edu/6.858/2014/schedule.html)  Lab 5: Browser security

####受害者登陆myzoo.com.

![login](img/login.png)

####受害者在没有登出的情况下访问攻击网站evil1.com.

![browse](img/evil.png)

####前面两步已经满足了CSRF攻击的条件，所以结果就是攻击实现,用户网站内部zoobars丢失。

![attack](img/attack.png)

##攻击介绍


####下面查看myzoo.com网站中transfer页面源码。

![transfer](img/myzoo.png)

####然后根据transfer页面中的代码伪造一个form表单，内容同transform动作一一对应。为了在攻击网站中隐藏这个form表单，所以创建一个iframe，将其设置为隐藏，最后设置form表单中的target指向这个表单。

![evil](img/evil2.png)

