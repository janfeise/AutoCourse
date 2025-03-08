# Bug

1. 知到自动评论脚本存在的Bug

	> - index out of range，如果check(answer)一直返回false，那么index会越界
	> 	![image-20241204103950013](pic/image-20241204103950013.png)
	> - check(answer)：有的回答字数皆小于7，那么会一直返回false；解决办法：回答不能以“大学”，“学院”结尾，可以以“大学。”，“学院。”结尾
	> 	![image-20241204104108510](pic/image-20241204104108510.png)