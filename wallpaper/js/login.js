function login() {
    // 创建一个字符串来存储登录界面的HTML代码
    var str = "";
  
    // 创建一个表单元素
    str += '<form>';
  
    // 创建一个用户名输入框
    str += '<label for="username" style="margin: 2px 5px 2px 5px">用户名</label>';
    str += '<input type="text" type="textbox" id="username" style="margin: 2px 5px 2px 5px"><br>';
  
    // 创建一个密码输入框
    str += '<label for="password" style="margin: 2px 5px 12px 5px">密码</label>';
    str += '<input type="password" id="password" style="margin: 2px 5px 12px 5px"><br>';
  
    // 创建一个登录按钮
    str += '<a href="#" style="margin: 10px 10px 10px 10px">登录</a>';
    str += '<a href="#" style="margin: 10px 10px 10px 10px">注册</a>';
    str += '<a href="#" style="margin: 10px 0px 10px 10px">忘记密码</a>';
  
    // 关闭表单元素
    str += '</form>';
    
    // 返回登录界面的HTML代码
    return str;
  }
  document.getElementById("login").innerHTML = login();
  document.querySelectorAll('a').forEach(function(element) {
    element.addEventListener('click', function(event) {
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      console.log('@username@', username);
      console.log('@password@', password);
      console.log(element.textContent)
    });
  });
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    console.log("退出")
  }
});
  