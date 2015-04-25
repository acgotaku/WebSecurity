# SQL Injection

Structured Query Language Injection

---

## 数据库分析

通常Web应用程序使用的数据库保存一下信息：  
用户账户、证书和个人信息；  
所销售商品的介绍与价格；  
订单、账单和支付细节；  
每名应用程序用户的权限。  
数据库中的信息通过SQL访问。SQL可用于读取、更新、增加或删除数据库中保存的信息。如果建立语句的方法不安全，那么应用程序可能易于受到SQL注入攻击。

##基本漏洞

以书籍零售商使用的Web应用程序为例，该应用程序允许用户根据作者、书名、出版商等信息搜索产品。  
当一个用户搜索Wiley出版的所有书籍时，应用程序执行以下查询：  
SELECT author ,title, year FROM books WHERE publisher = ‘ Wiley’ and published = 1  
分析：在这个查询中，等号左边的词由SQL关键字，表和数据库列名称构成。这个部分的全部内容由程序员在创建应用程序时建立。当然表达式Wiley由用户提交，它是一个数据项。SQL查询中的字符串数据必须包含在单引号内，与查询的其他内容分隔开来。  
漏洞一：SELECT author ,title, year FROM books WHERE publisher = ‘O’Reilly’ and published = 1  
在这个实例中，查询解释器以和前面一个示例相同的方式到达字符串数据位置。它解析这个包含在单引号中的数据，得到O。然后遇到Reilly’，这并不是有效的SQL语法，因此应用程序报错。  
漏洞二：攻击者通过对查询进行修改，通过以下搜索项，返回零售商目录中的每一本书籍。  
Wiley ‘ OR 1=1--  
此时，应用程序将执行以下的查询：  
SELECT author, title, year FROM books WHERE publisher = ‘Wiley’ OR 1=1-- ‘ and published=1  
这个查询对开发者查询中的WHERE子句进行修改，增加另外一个条件。数据库将检查书籍表中的每一行，提取published列值为Wiley或其中1=1的每条记录。因为1=1永真，所以数据库将返回书籍表中的所有记录。  
如下图：

![register](img/register.png)  
用户注册，用户名为abcd，用户密码为abcd；  

![login1](img/login1.png)  
输入用户名，密码之后，点击“register”，界面跳转到上界面；  

![injection](img/injection.png)  
用“w’ or 1=1#”实现SQL注入，由于mysql中的注释符为“#”；  

![login2](img/login2.png)  
点击“login”之后获取之前用户注册跳转的界面。  

##不同语句类型的注入

1、SELCET语句  
作用：从数据库中获取信息。  
使用方法：查询WHERE子句，由于WHERE子句一般在SELECT语句的最后，攻击者可以使用注释符号将查询截短到其输入的结束位置，而不使整个语法失效。

2、INSERT语句  
作用：在表中建立一个新的数据行。  
使用方法：攻击者完全盲目地注入一个INSERT语句也能够从应用程序中提取出字符串数据。比如攻击者介意拦截数据库版本的字符串，并把它插入自己用户资料的一个字段中。

3、UPDATE语句  
作用：修改表中的一行或几行数据。  
使用方法：先核实用户的现有密码是否正确，如果密码无误，就用新的值更新它。若这项功能存在SQL注入漏洞，那么攻击者就能避开现有的密码检查，通过输入“admin’--”这样的用户更新管理员密码。

4、DELETE语句  
作用：删除表中的一行或几行数据。  
使用方法：通常使用WHERE子句告诉数据库更新表中哪些行的数据，并可能在这个子句中并入用户提交的数据。破坏正常运行的WHERE子句可能造成严重的后果。


##SQL注入漏洞类型

1、注入字符串数据  
若SQL查询合并用户提交的数据，它会将这些数据包含在单引号中。为利用任何SQL注入漏洞，则需摆脱这些引号的束缚。

2、注入数字数据  
如果SQL查询合并用户提交的数字数据，应用程序仍然会将它包含在单引号之中，作为字符串进行处理。 因此，一定要执行前面描述的针对字符串数据的渗透测试步骤。但是，许多时候，应用程序会将数字数据以数字格式直接传送到数据库中，并不把它放入单引号中。