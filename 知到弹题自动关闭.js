/* 
* 此脚本用于刷“知到”的课程，并自动关闭弹题，可指定脚本运行时长，获得习惯分
*
* 11/13/2024 Tilex
*/

// 可修改为对应课程，和刷课的时长
var course = "中国法律史"; // 课程名，注意：英文引号不可去掉
var minute = 27; // 27分钟（脚本运行时长），习惯分大概在25分钟左右

// 启用无障碍服务，如果未启用则提示用户
auto();

// 
function main() {
    // 1. 打开手机，解锁屏幕，若手机已解锁则开始刷课
    openPhone();
    // 2. 打开知到，刷课
    CLASS();
}

main();

// 定时器停止
var timePop; // 提前声明 timePop 变量

setTimeout(function() {
    clearInterval(timePop);  // 结束弹窗监测
    home(); // 退出课程页面，返回手机主页面
    printInfo("脚本运行结束，即将退出课程，返回手机主界面");
    exit(); // 退出整个脚本
}, 1000 * 60 * minute); // 控制脚本运行时长

// 打开手机屏幕
function openPhone() {
    if (!device.isScreenOn()) {
        // 如果屏幕未点亮，点亮屏幕
        device.wakeUp();
        sleep(1000); // 等待屏幕亮起
        // 调用解锁函数
        unlock();
    }
}

// 上滑解锁：我的手机没有设置锁屏；若有锁屏，解开锁屏，找到auto.js软件，点击运行脚本即可
function unlock() {
    // 上滑解锁：设置滑动起点和终点的坐标
    let startX = device.width / 2; // 屏幕宽度的中间
    let startY = device.height * 0.8; // 屏幕高度的80%
    let endX = startX;
    let endY = device.height * 0.2; // 屏幕高度的20%
    
    // 模拟滑动操作
    gestures([0, 500, [startX, startY], [endX, endY]]); // 0表示无延迟，500表示滑动持续时间
}

// 刷课
function CLASS() {
    // 打开知到
    var packageName = getPackageName("知到");
    // 错误处理，若未安装知到应用，脚本终止
    if (packageName == null) 
    {
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
        if (text(course).exists()) {
            // 进入课程
            click(course);
            printInfo("进入课程：" + course);
            sleep(5000);
            // 关闭弹窗
            id("im_close").findOne().click();
            sleep(5000);
            // 播放视频
            id("continue_study_btn").findOne().click();
            sleep(5000);
            // 使用流量继续播放
            if (text("继续播放").exists()) {
                click("继续播放");
                printInfo("使用流量继续播放视频");
                sleep(2000);
            }
            // 弹窗处理：启动定时器
            timePop = setInterval(pop, 1000);  // 每秒检查一次弹题
        }
    }
}

// 处理弹题
function pop() {
    // 一直检测是否有弹窗出现，然后关闭弹窗
    if (textContains("弹题是为了帮助同学们巩固知识点，不会影响到大家作业和考试的成绩。").exists()) 
    {
        // 题目加载成功
        printInfo("弹题出现");
        sleep(2000);
        if (textContains("A").exists()) {
            textContains("A").findOne().click();
            sleep(2000);
            // 点击关闭按钮
            closeButton();
            printInfo("弹题关闭成功！");
        }
        // 题目没有加载出来，直接关闭弹题
        else
        {
            closeButton();
            printInfo("弹题关闭成功！");
        }
    }
}

// 点击关闭按钮
function closeButton ()
{
    sleep(2000);
    if (text("关闭").exists())
    {
        click("关闭");
        toast("关闭弹题成功");
    }
    else
    {
        console.error("弹题关闭失败");
    }
}

// 输出信息
function printInfo(info)
{
    toast(info);
    console.log(info);
}
