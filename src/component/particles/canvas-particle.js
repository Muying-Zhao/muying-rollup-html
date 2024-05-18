// 立即执行函数表达式
// (function () {
//     // 你的代码在这里
//     var localVariable = '这是一个局部变量';

//     function localFunction() {
//         // 这是一个局部函数
//         console.log(localVariable);
//     }

//     // 假设你想在外部可以访问某个方法
//     window.publicFunction = function () {
//         localFunction();
//     };
// })();

var CanvasParticle = (function () {
  // 获取指定标签名的元素数组
  function getElementByTag(name) {
    return document.getElementsByTagName(name);
  }
  // 通过ID获取元素
  function getELementById(id) {
    return document.getElementById(id);
  }
  // 根据传入的配置初始化canvas
  function canvasInit(canvasConfig) {
    // 如果未传入配置，则使用空对象作为默认配置
    canvasConfig = canvasConfig || {};
    var html = getElementByTag("html")[0];
    // 获取指定的div作为canvas的容器
    var body = document.getElementById("mydiv");
    // 创建一个canvas元素
    var canvasObj = document.createElement("canvas");

    // 定义一个包含canvas对象和其他相关信息的对象
    var canvas = {
      element: canvasObj, // canvas元素本身
      points: [], // 存储粒子点的数组
      // 默认配置
      config: {
        vx: canvasConfig.vx || 4, // x轴速度，正为右，负为左
        vy: canvasConfig.vy || 4, // y轴速度
        height: canvasConfig.height || 2, // 小球的高
        width: canvasConfig.width || 2, // 小球的宽
        count: canvasConfig.count || 100, // 点的个数
        color: canvasConfig.color || "121, 162, 185", // 点的颜色
        stroke: canvasConfig.stroke || "130,255,255", // 线条颜色
        dist: canvasConfig.dist || 6000, // 点的吸附距离
        e_dist: canvasConfig.e_dist || 20000, // 鼠标吸附加速距离
        max_conn: 10, // 点到点最大连接数
      },
    };

    // 获取canvas的2D渲染上下文
    if (canvas.element.getContext("2d")) {
      canvas.context = canvas.element.getContext("2d");
    } else {
      return null;
    }
    // 设置body的样式，去除内边距和外边距
    body.style.padding = "0";
    body.style.margin = "0";
    // 将canvas元素添加到body中
    // body.replaceChild(canvas.element, canvasDiv);
    body.appendChild(canvas.element); // 追加canvas元素到body的子元素列表中
    // 设置canvas元素的样式，使其固定在屏幕左上角，并置于最底层
    canvas.element.style = "position: fixed; top: 0; left: 0; z-index: -1;";
    // 调用函数设置canvas的大小
    canvasSize(canvas.element);
    // 当窗口大小改变时，重新设置canvas的大小
    window.onresize = function () {
      canvasSize(canvas.element);
    };
    // 当鼠标在body上移动时，记录鼠标的位置
    body.onmousemove = function (e) {
      var event = e || window.event; // 兼容老版本的浏览器
      canvas.mouse = {
        x: event.clientX, // 鼠标相对于浏览器窗口可视区的X坐标
        y: event.clientY, // 鼠标相对于浏览器窗口可视区的Y坐标
      };
    };
    // 当鼠标离开文档时，清除鼠标位置信息
    document.onmouseleave = function () {
      canvas.mouse = undefined;
    };
    // 每隔40毫秒调用一次drawPoint函数，用于绘制粒子
    setInterval(function () {
      drawPoint(canvas);
    }, 40);
  }

  // 设置canvas的大小
  function canvasSize(canvas) {
    // 原本的代码尝试获取窗口的宽高
    // canvas.width = window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
    // canvas.height = window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;

    // 获取特定div（mydiv）的宽高样式值，并转换为整数
    var width = document.getElementById("mydiv").style.width;
    var height = document.getElementById("mydiv").style.height;
    width = parseInt(width);
    height = parseInt(height);
    canvas.width =
      width ||
      window.innerWeight ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    canvas.height =
      height ||
      window.innerWeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
  }

  // 绘制点
  function drawPoint(canvas) {
    // 获取画布上下文
    var context = canvas.context,
      point, // 点的变量
      dist; // 点与画布边缘的距离
    // 清除画布上的所有内容
    context.clearRect(0, 0, canvas.element.width, canvas.element.height);
    // 开始一个新的路径
    context.beginPath();
    // 设置填充颜色
    context.fillStyle = "rgb(" + canvas.config.color + ")";
    // 遍历要绘制的点的数量
    for (var i = 0, len = canvas.config.count; i < len; i++) {
      // 如果点的数量不足，则添加新的点
      if (canvas.points.length != canvas.config.count) {
        // 初始化所有点
        point = {
          // 随机生成x坐标
          x: Math.floor(Math.random() * canvas.element.width),
          // 随机生成y坐标
          y: Math.floor(Math.random() * canvas.element.height),
          // 随机生成x方向的速度
          vx: canvas.config.vx / 2 - Math.random() * canvas.config.vx,
          // 随机生成y方向的速度
          vy: canvas.config.vy / 2 - Math.random() * canvas.config.vy,
        };
      } else {
        // 处理已经存在的点的速度和位置，并进行边界处理
        point = borderPoint(canvas.points[i], canvas);
      }
      // 绘制一个矩形点（以点的位置为中心）
      context.fillRect(
        point.x - canvas.config.width / 2,
        point.y - canvas.config.height / 2,
        canvas.config.width,
        canvas.config.height
      );
      // 更新点的位置
      canvas.points[i] = point;
    }
    // 绘制线条（鼠标移动轨迹或点与点之间的连线）
    drawLine(context, canvas, canvas.mouse);
    // 关闭路径
    context.closePath();
  }

  // 边界处理
  function borderPoint(point, canvas) {
    var p = point;
    // 如果点的x坐标小于等于0或大于等于画布宽度
    if (point.x <= 0 || point.x >= canvas.element.width) {
      // 反转x方向的速度
      p.vx = -p.vx;
      // 根据新的速度更新x坐标（这里直接加是因为速度已经反转，相当于向相反方向移动）
      p.x += p.vx;
      // 如果点的y坐标小于等于0或大于等于画布高度
    } else if (point.y <= 0 || point.y >= canvas.element.height) {
      // 反转y方向的速度
      p.vy = -p.vy;
      // 根据新的速度更新y坐标
      p.y += p.vy;
    } else {
      // 如果点不在边界上，则按照当前的速度更新位置
      p = {
        x: p.x + p.vx,
        y: p.y + p.vy,
        vx: p.vx,
        vy: p.vy,
      };
    }
    // 返回处理后的点
    return p;
  }

  // 绘制线条
  function drawLine(context, canvas, mouse) {
    // 确保context是有效的，如果不传入则使用canvas的context属性
    context = context || canvas.context;
    // 遍历所有点的数量
    for (var i = 0, len = canvas.config.count; i < len; i++) {
      // 初始化当前点的最大连接数
      canvas.points[i].max_conn = 0;
      // 遍历其他所有点
      for (var j = 0; j < len; j++) {
        if (i != j) {
          // 计算两点之间的距离的平方（为了节省计算时间，不需要开平方）
          dist =
            Math.round(canvas.points[i].x - canvas.points[j].x) *
              Math.round(canvas.points[i].x - canvas.points[j].x) +
            Math.round(canvas.points[i].y - canvas.points[j].y) *
              Math.round(canvas.points[i].y - canvas.points[j].y);
          // 如果两点之间的距离小于或等于设定的吸引距离，并且当前点的连接数小于最大连接数
          if (
            dist <= canvas.config.dist &&
            canvas.points[i].max_conn < canvas.config.max_conn
          ) {
            // 增加当前点的连接数
            canvas.points[i].max_conn++;
            // 根据两点之间的距离设置线条的粗细和透明度
            // 距离越远，线条越细，透明度越低
            context.lineWidth = 0.5 - dist / canvas.config.dist; // 线条粗细
            context.strokeStyle =
              "rgba(" +
              canvas.config.stroke +
              "," +
              (1 - dist / canvas.config.dist) +
              ")"; // 线条颜色（包含透明度）
            // 开始一个新的路径来绘制线条
            context.beginPath();
            // 从点i移动到点j
            context.moveTo(canvas.points[i].x, canvas.points[i].y);
            context.lineTo(canvas.points[j].x, canvas.points[j].y);
            context.stroke();
          }
        }
      }
      // 如果传入了鼠标位置（mouse） ，点到鼠标的连线
      if (mouse) {
        // 计算当前点与鼠标位置之间的距离的平方（为了节省计算时间，不需要开平方）
        dist =
          Math.round(canvas.points[i].x - mouse.x) *
            Math.round(canvas.points[i].x - mouse.x) +
          Math.round(canvas.points[i].y - mouse.y) *
            Math.round(canvas.points[i].y - mouse.y);
        // 当鼠标与点的距离大于吸引距离（canvas.config.dist）但小于等于扩展吸引距离（canvas.config.e_dist）时
        // 稍微改变点的位置以接近鼠标，产生加速效果
        if (dist > canvas.config.dist && dist <= canvas.config.e_dist) {
          canvas.points[i].x =
            canvas.points[i].x + (mouse.x - canvas.points[i].x) / 20;
          canvas.points[i].y =
            canvas.points[i].y + (mouse.y - canvas.points[i].y) / 20;
        }
        // 如果鼠标与点的距离小于等于扩展吸引距离（canvas.config.e_dist）
        // 绘制一条从当前点到鼠标位置的线条
        if (dist <= canvas.config.e_dist) {
          // 设置线条宽度为1
          context.lineWidth = 1;
          // 设置线条的颜色（包括透明度），根据距离来调整透明度
          context.strokeStyle =
            "rgba(" +
            canvas.config.stroke +
            "," +
            (1 - dist / canvas.config.e_dist) +
            ")";
          // 开始一个新的路径来绘制线条
          context.beginPath();
          context.moveTo(canvas.points[i].x, canvas.points[i].y);
          context.lineTo(mouse.x, mouse.y);
          context.stroke();
        }
      }
    }
  }
  return canvasInit;
})();
