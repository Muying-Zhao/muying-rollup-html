function loadCSS(href) {
  // 创建一个新的link元素
  const link = document.createElement("link");

  // 设置link元素的rel属性为stylesheet，表明这是一个CSS样式表
  link.rel = "stylesheet";

  // 设置link元素的href属性为传入的CSS文件的URL
  link.href = href;

  // 将link元素添加到文档的head部分
  document.head.appendChild(link);
}
