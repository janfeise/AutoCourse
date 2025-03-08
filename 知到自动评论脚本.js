console.show(); // 测试

// 可修改为对应课程，和刷课的时长
var course = "中国法律史"; // 课程名，注意：英文引号不可去掉
var count = 100; // 评论条数，建议不要太少
var school = "你的学校名称"; // 全名：如XX大学
var depth = 13; // 每个版本depth不同，根据实际情况修改

var finishCount = 1; // 无需更改，该变量记录：实际回答问题数

// 启用无障碍服务，如果未启用则提示用户
auto();

function main() {
  // 1. 进入该课程的讨论区
  goToComment();
  // 2. 完成讨论
  accomplishComment();
}

main();

function goToComment() {
  // 1. 进入知到主页
  goToZhiDao();
  // 2. 进入课程讨论区
  goToCommentArea();
}

/**
 * goToComment的辅助函数：进入知到课程页面
 *
 * @function goToZhiDao
 */
function goToZhiDao() {
  // 打开知到
  var packageName = getPackageName("知到");
  // 错误处理，若未安装知到应用，脚本终止
  if (packageName == null) {
    throw new Error("知到应用未安装，脚本终止执行");
  }

  app.launch(packageName);
  printInfo("知到软件已打开");
  sleep(5000);
  // 跳转课程页面
  if (text("学习").exists()) {
    click("学习");
    printInfo("进入学习页面");
    sleep(5000);
  }
}

/**
 * goToComment的辅助函数：现在位置是课程页面，只需进入课程，然后点击回答，即可进入讨论区
 *
 * @function goToCommentArea
 */
function goToCommentArea() {
  if (text(course).exists()) {
    click(course);
    printInfo("进入课程：" + course);
    sleep(5000);
    // 关闭弹窗
    id("im_close").findOne().click();
    sleep(5000);
    // 进入讨论区
    id("tv_question").findOne().click();
    sleep(3000);
  }
}

/**
 * 实现：讨论
 *
 * @function accomplishComment
 */
function accomplishComment() {
  printInfo("进入讨论页面");
  findListQuestion();
  printInfo("此次脚本运行共回答了：" + finishCount + "条讨论");
}

/**
 * accomplishComment的辅助函数：找到所有问题
 *
 * @function findListQuestion
 */
function findListQuestion() {
  // 查找评论列表
  //   var listComment = className("android.widget.ListView").findOne();
  var listComment = enoughQuestion(count); // 该函数未实现

  if (listComment == null) {
    printInfo("没有找到评论列表，请联系作者");
    exit(); // 直接退出整个脚本
  }
  // 进入单个讨论
  printInfo("找到评论列表");
  var comments = listComment.children();
  if (comments.empty()) {
    printInfo("没有可见评论");
    exit(); // 直接退出整个脚本
  }

  var length = comments.size(); // 讨论的条数
  printInfo("共有" + length + "条讨论");
  for (var i = 1; i < length; i++) {
    var comment = comments.get(i);

    if (comment.clickable()) {
      // 点击评论，进入评论详情页面
      comment.click();
      sleep(1000); // 等待页面加载

      // 回答问题
      printInfo("进入第" + i + "条评论");
      answerComment();
      sleep(2000);

      // 返回评论列表，进入下一次循环：即回答下一个问题
      back();
      sleep(1000);
    }
  }
}

/**
 * findListQuestion的辅助函数：手机当前页面只会显示少数的问题，需滑动到底部才会加载新的问题
 *      - 功能：找到足够的问题
 *
 * @function enoughQuestion
 * @param {int} number: 所需的问题数
 */
function enoughQuestion(number) {
  sleep(1000);
  var listComment = className("android.widget.ListView").findOne();
  var length = listComment.children().length;
  while (length < number) {
    customScrollDown();
    sleep(1000);
    listComment = className("android.widget.ListView").findOne();
    length = listComment.children().length;
    if (checkEndOfThePage == true) {
      printInfo("已加载所有问题");
      break;
    }
  }
  return listComment;
}

/**
 * enoughQuestion：的辅助函数，实现页面滑动
 *
 * @function customScrollDown
 */
function customScrollDown() {
  printInfo("加载更多问题中......");
  var startX = device.width / 2;
  var startY = device.height * 0.8;
  var endY = device.height * 0.2;

  // 滑动
  gestures([0, 500, [startX, startY], [startX, endY]]);
  sleep(1000);
}

/**
 * enoughQuestion: 的辅助函数，如果滑到页面最底部，则结束
 *
 * @function checkEndOfThePage
 * @returns {boolean}
 *      - true: 表示已经滑到页面最底部了
 *      - false：表示没有滑到页面最底部
 */
function checkEndOfThePage() {
  if (textContains("没有更多了").exists()) {
    return true;
  }
  return false;
}

/**
 * findListQuestion的辅助函数: 回答讨论，findListQuestion函数会依次遍历所有问题，每进入一个问题就使用该函数回答问题
 *
 * @function answerComment
 */
function answerComment() {
  sleep(3000); // 等待页面加载

  var answer = getAnswer(); // 获取answer

  if (textContains("我来回答").exists() && answer) {
    click("我来回答");
    // 回答

    // 找到ID为"et_text"的EditText控件
    var et_text = id("et_text").findOne();
    if (et_text) {
      // 设置EditText的文本内容为第一个答案
      et_text.setText(answer);
      sleep(1000);

      // 发布回答
      if (textContains("发布回答").exists()) {
        click("发布回答");
        printInfo("第" + finishCount++ + "个回答：" + answer);
        sleep(1000);
      }
    }
  } else {
    printInfo("该问题你已经回答过了");
  }
}

/**
 * answerComment的辅助函数：获取该问题发布的正确answer
 *
 * @function getAnswer
 */
function getAnswer() {
  // 查找所有深度为12的View控件
  var index = 1; // 默认索引
  var views = className("android.widget.TextView").depth(depth).find();

  var answer = views[index].text();

  // 检查answer是否合法
  while (check(answer) == false) {
    try {
      answer = views[++index].text();
    } catch (error) {
      answer = "";
      printInfo("该评论字数太少");
      
    }
  }

  return answer;
}

/**
 * getAnswer的辅助函数：检查answer是否合法
 *
 * @param {string} answer: 检查answer是否合法
 * @returns {boolean}
 *      -true: 表示合法
 *      -false：不合法
 */
function check(answer) {
  var minLength = 7; // 最小长度设定：防止复制到名字
  var fobiddenWord = school; // 禁止包含的内容, 可能会复制到学校的名称而出错
  if (answer.length > minLength && !answer.includes(fobiddenWord)) {
    return true;
  }
  return false;
}

// 输出信息
function printInfo(info) {
  toast(info);
  console.log(info);
}
