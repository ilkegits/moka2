/* ShiCards: the units and lessons of HSK 2 and up (HSK 1's are in index.html). BUILT by tools/build_course.py from the
   lesson plans in tools/course/: change those, not this file.
   SHI_COURSE[level]: a unit line "## English|中文", then one line per lesson, "Title:word word word".
   Numbers never move once a level is out: level L's units are L*100+1 and on, its lessons L*1000+1 and on, in the
   order written here. The meaning and reading a lesson shows are the word list's (dict/hsk.tsv), or the hand-written
   ones in dict/gloss.tsv. SHI_COMIC_LV: the levels that have a comics file, comics/hsk<level>.js.
   When this file changes, raise the number in index.html's <script src="course.js?v=...">. */
window.SHI_COMIC_LV = [2];
window.SHI_COURSE = {
  2: `
## Eating out|饭馆
Tea and coffee:咖啡 奶茶 绿茶 红茶 饭馆 酒店
A table for two:位 条 鱼 肉 等 一会儿
Colours:颜色 红色 白色 黑色 绿色
At the mall:商场 裤子 手表 包 万 送
Good, better, best:比 最 高 长 不错 坏 错
Don't!:别 让 就 啊 得 着

## Which way?|旁边
Left and right:左 右 左边 右边 旁边 往
Front and back:面 前面 后面 上面 下面 里面 外面
Doors and roads:门 门口 楼 洗手间 路 路上
Near and far:远 近 离 从 地 间
Walk and run:走 走路 跑 站 动 快 慢
How often:时 有时 经常 每 周 次

## Out and about|旅游
In and out:进 出 进来 进去 出来 出去
Up and down:上来 上去 下来 下去 起来
There and back:回来 回去 过来 过去 过
Bus and metro:车站 地铁 公交车 打车 票 门票
At the airport:机场 机票 出门 出国 外国
On a trip:旅游 游 已经 快要 开始 完

## Body and sport|运动
Body:身体 头 手 眼睛 个子 洗
Feeling ill:疼 药 药店 累 舒服 床
Ball games:球 足球 篮球 踢 打 运动
Hobbies:爱好 跑步 游泳 跳舞 画 上网 网上
Fun together:有意思 没意思 一起 跟 快乐 笑
Blue sky:晴 阴 鸟 飞 花

## School days|考试
Exams:考 考试 题 词 懂 意思
In class:教 教室 班 高中 开学
School bag:书包 本子 笔 打开 拿
Don't forget:忘 记得 准备 告诉 事情 希望
Why? Because:为什么 因为 所以 虽然 但是 但

## Family and New Year|过年
Grandparents:爷爷 奶奶 丈夫 妻子 自己
Children:男孩儿 女孩儿 小孩儿 小时候 从小
Names:姓 姓名 名 介绍 生日 过年
Lend a hand:帮 帮忙 不好意思 可能 正
Like this:这样 那样 这么 那么 还是
`,
  3: `
## Setting off|出发
Setting off:出发 离开 带 行李 箱子 护照 丢
On the road:街 马路 路口 路边 汽车 辆 司机
East and west:东 南 西 北 向 方向 地图
North and south:南方 北方 东方 西方 东北 东南 西北 西南
Where is it?:中 中间 面前 身边 附近 到处
Near and far:地方 地点 外地 世界 国家 来自
Ways to go:船 骑 自行车 高铁 起 起飞 晚点 经过
Hills and rivers:山 爬 河 海 树 草

## People|咱们
People:男人 女人 大人 老 老人 别人 咱们
Family:子 姐妹 叔叔 阿姨 夫妻 爱人 结婚 出生
Body:脸 嘴 耳朵 头发 毛 腿 脚
Looks:年轻 胖 瘦 矮 身高 可爱
Meeting up:见面 遇到 遇见 认得 分开 不见 聊 聊天儿
Having guests:客人 做客 请客 欢迎 礼物 热情

## Food and shopping|菜单
Hungry:饿 饱 渴 米 方便面 蛋糕 糖
Drinks:饮料 矿泉水 酒 啤酒 冰 加 瓶子
At the table:菜单 外卖 用 碗 盘子 筷子 勺子
At the market:斤 公斤 香蕉 西瓜 甜 新鲜 尝
Paying:银行 卡 银行卡 信用卡 借 一共 角
Clothes:衬衫 上衣 大衣 裙子 短 短裤 鞋 双
Colour and fit:蓝 黄色 试 换 合适 大小 旧

## Home and town|搬家
Things at home:电 灯 空调 冰箱 洗衣机 沙发
House:房子 屋子 室 层 楼梯 电梯 卫生间
Cleaning:扫 打扫 干净 脏 洗澡 牙 刷 牙刷
Moving house:搬 搬家 邻居 环境 安静 方便 生活
In town:市 城市 小区 宾馆 图书馆 球场
Animals:动物 种 大熊猫 马 牛 羊 鸡 养
Parks:园 公园 花园 草地 开花 动物园

## Time and seasons|四季
Days:前天 后天 前年 后年 周末 工作日
Holidays:节 节日 过节 假期 放 放假 休假 请假
Seasons:季 季节 四季 春天 夏天 秋天 冬天 新年
Sun, wind and rain:太阳 月亮 风 刮 凉快 雨衣 伞
Before and after:以前 以后 先 然后 后来 最后 终于
Just now:刚 刚刚 刚才 最近 马上 突然
How long:久 好久 不久 半天 刻 一直 直到
Often:常 常常 常见 常用 总 总是 平时 习惯

## School|校园
At school:校园 校长 班级 年级 初中 学期 放学 迟到
Students:男生 女生 留学 留学生 外语 语言
Books:课本 课文 页 故事 查 字典 词典
Pen and paper:铅笔 纸 张 记 笔记 笔记本 黑板
Sentences:句 句子 段 遍 对话 讲 回答
Homework:作业 练 练习 复习 成绩 提高 认真 努力
Subjects:数学 历史 文化 体育 兴趣 感兴趣
Hard or easy:难 难题 容易 简单 聪明 水平

## Free time|比赛
Sports:体育馆 网球 羽毛球 锻炼 跳 健康
The big match:比赛 运动会 员 运动员 参加 得分 坚持
Music and games:游戏 音乐 声 声音 耳机 难听
Shows and stars:表演 节目 晚会 有名 名人 画家
Taking photos:照 照片 照相 拍照 相机 游客 难看
Phones and news:网站 号码 关 开机 关机 新闻 报纸
Letters:信 封 邮件 邮箱 发 收 收到 接

## Feeling and thinking|心里
Happy and sad:开心 喜爱 满意 难过 生气 哭 感到 心里
Worries:怕 害怕 担心 急 着急 小心 放心
Sick:感冒 发烧 病人 住院 出院 检查 照顾
Caring:关心 关注 注意 关系 帮助 愿意
Think and choose:认为 以为 相信 同意 选 选择 决定 打算
I see:明白 清楚 懂得 了解 发现 听说 忘记

## Getting things done|办法
Getting it done:办 干 办法 方法 完成 结束 解决
Office:办公室 经理 同事 服务 会议 开会 名单
Should and must:该 应该 必须 一定 不用 可
Want and get:需要 要求 得到 受 受到 机会
Changes:变 变成 变化 发生 发展 影响
Describing things:重要 主要 一般 奇怪 安全 有用
Same or different:一样 不同 其他 别的 像 好像 差

## Little words|如果
By, for and about:把 被 为 为了 根据 关于 有关
If and only:如果 的话 只要 只有 才 只是 只能
And, or, but:又 或 或者 可是 而且 不但 一边
More and most:更 越 极 挺 比较 特别
Roughly:大概 几乎 差不多 好多 以上 以下
Joining ideas:比如 除了 以外 其实 看来 当然
What shall we do?:怎样 怎么办 行 不行 最好 一块儿
`,
  4: `
## Food and drink|美食
Meals:食物 食品 美食 早餐 午餐 晚餐 中餐 快餐
Eating out:餐厅 食堂 顿 订 排 排队 够 不够 剩
Tastes:味道 闻 香 辣 酸 咸 苦 鲜
In the kitchen:厨房 厨师 刀 西红柿 油 盐 汤 烤 熟
A party:聚 聚会 邀请 庆祝 祝 祝贺 红包
Snacks:零食 小吃 饼干 巧克力 酸奶 馒头 月饼
Drinks:果汁 汽水 茶叶 葡萄 葡萄酒 白酒 干杯

## Home and town|客厅
Push and pull:拉 推 按 拍 敲 响 挂
Broken:破 掉 倒 修 修理 弄 师傅
Tidying up:收拾 整理 装 乱 扔 垃圾 桶
Describing things:厚 细 粗 轻 深 低 亮 满 空
At home:客厅 大厅 窗户 院子 家具 钥匙 盒子
Clothes:外套 毛衣 帽子 袜子 皮鞋 眼镜 背包 戴 脱
Renting a room:租 出租 房东 房租 地址 费 费用 收费
Town and country:城 村 农村 区 市区 郊区 首都

## Body and health|体检
Life:生 活 死 生命 人生 一生 日子
Body:鼻子 胳膊 肚子 背 皮肤 血 流 全身
Body moves:动作 步 抬 抬头 点头 举 抱 指
Sleep:困 躺 醒 梦 做梦 晚安 夜 夜晚 早晨
Danger:危险 严重 受伤 火 着火 烟 吸
Getting clean:厕所 镜子 毛巾 牙膏 擦 理发 卫生
At the clinic:大夫 护士 体检 体温 打针 咳 咳嗽 痛
Keeping fit:健身 健身房 力气 散步 体重 汗 功夫

## Family and people|家庭
Parents:父亲 母亲 父母 父子 父女 母子 母女 家长
Relatives:家庭 兄弟 孙子 孙女 亲戚 家乡 老家 俩
Men and women:性 男性 女性 男士 姑娘 小伙子 各位 对方
Ages:年龄 儿童 童年 少年 青年 中年 老年
Jobs:职业 警察 交警 记者 律师 工人 导游
Fans and members:观众 听众 读者 球迷 网友 会员 人员
Being polite:打招呼 礼貌 客气 感谢 抱歉 道歉 原谅
Rules:社会 公共 法律 规定 标准 符合 合格

## Getting around|交通
On the road:交通 道 道路 公路 高速 街道 桥 十字路口 堵车
Driving:停 停车 停车场 车位 车速 转 加油 加油站
By bus:乘 乘坐 乘客 大巴 电动车 座 座位 趟
Hurry up:赶 赶上 赶紧 赶快 快速 加快 速度
All around:入口 出口 对面 前方 底下 周围 左右 前后
On the way:外出 出行 顺便 路过 距离 公里 远离 目的地 到来
On time:准时 按时 及时 迟 推迟 提前 来得及 来不及 错过
Flying:航班 登机 安检 转机 降落 签证 旅客

## Trips and nature|旅行
Sky, land and sea:阳光 光 云 星星 土 江 海洋
Weather:气候 气 空气 吹 寒冷 暖和 凉
Temperature:温度 气温 高温 低温 降温 零下 摄氏度
In the forest:森林 树林 棵 叶子 鲜花 熊 老虎
Protecting nature:自然 大自然 植物 保护 环保 污染 塑料
The world:地球 全球 国际 亚洲 民族 东部 西部 南部 北部
On holiday:旅行 度假 旅馆 假日 节假日 暑假 寒假
Sightseeing:景点 景区 景色 美景 风景 参观 游玩

## Shops and post|购物
Shopping:购物 购买 逛 顾客 商品 货 牌 牌子 质量
Prices:价格 价钱 高价 低价 降价 打折 免费 值 值得
Paying:付 支付 交 现金 零钱 零花钱 结账
Count and weigh:数 数字 人数 算 倍 量 克 千克
Many and few:许多 大量 少量 多数 少数 数量 丰富 缺 缺少
News:消息 信息 通知 广播 播放 收听 联系
Post office:寄 快递 上门 取 回信 短信 回复 发送 发出
Online:互联网 网页 网址 密码 视频 信号 查找

## School|课堂
Teachers:教育 教学 教师 教授 教练 学院 院长
Reading:阅读 文章 作文 篇 小说 杂志 者 作者 作家
Marks:分数 答 答案 正确 错误 准 准确
Science:科学 科技 技术 专业 专门 基础 知识
In class:课堂 课程 功课 预习 自学 点名 师生 操场
Language:语法 词语 口语 听力 普通话 流利 翻译 文字
Exams:高考 报考 报名 考生 试题 笔试 期 期中 期末
University:入学 毕业 毕业生 本科 硕士 博士 研究生 学费

## Fun and games|演出
Great!:棒 厉害 精彩 著名 帅 美 美丽
Art:艺术 作品 幅 图 图片 片 吸引
Teams:队 球队 队长 队员 组 小组 乒乓球 排球
Win and lose:场 大赛 参赛 赢 赢得 输 打败 成功 失败
Prizes:奖 奖学金 获奖 获得 取得 获取 优秀
On stage:台 演 演出 演员 话剧 京剧 剧院 电视剧 观看
Music:琴 钢琴 弹 首 歌手 歌声 演唱 流行
Jokes:开玩笑 笑话 好笑 幽默 有趣 无聊 猜

## Work|办公
In charge:负责 负责人 责任 管 管理 项 任务 安排
Business:生意 市场 经济 广告 推出 厂 工厂 竞争
Pay:工资 收入 奖金 赚 省 节约 浪费
At the office:办公 办事 办理 单位 部 部门 出差
Printing:文件 资料 材料 打印 打印机 复印 份
Dates and times:日期 月份 底 年底 末 世纪 时间表 秒
Filling in forms:表 表格 列 填写 证件 身份证 国籍 性别
Getting a job:招聘 应聘 面试 申请 打工 干活儿 加班

## Feelings|心情
Feeling:感 感觉 感受 感情 感动 感人 心 心情 内心
Happy:幸福 愉快 兴奋 激动 轻松 热闹 美好
Sad:伤心 失望 后悔 可惜 难受 辛苦 困难
Nervous:紧张 压 压力 害羞 吃惊 冷静 放松
Fed up:烦 烦恼 麻烦 打扰 讨厌 不满 受不了
Proud and brave:骄傲 得意 自信 信心 勇敢 敢 羡慕
Love and friends:爱情 爱心 浪漫 约 约会 陪 友情 友谊
Memories and dreams:回忆 印象 难忘 日记 梦想 理想 永远

## Getting along|性格
Talking it over:谈 讨论 商量 交流 建议 提醒 解释
Speaking up:提 提出 提到 指出 表示 表现 喊
Yes and no:嗯 答应 接受 拒绝 允许 禁止 千万
Ways and views:法 看法 想法 说法 做法 主意 意见
Praise and blame:表扬 鼓励 支持 尊重 重视 批评 反对 误会
Character:性格 脾气 态度 样子 优点 缺点 好处 坏处
Lively or lazy:友好 活泼 积极 诚实 懒 笨 假
Careful or careless:仔细 细心 耐心 粗心 随便 故意 严格

## Ideas and reasons|原因
Cause and effect:原因 结果 情况 引起 产生 效果 有效
Plans and goals:计划 定 目标 目的 过程 条件 关键 重点
Thinking:考虑 理解 判断 估计 熟悉 怀疑 肯定 确实
Finding out:调查 研究 查看 证 证明 保证 总结
Parts and kinds:部分 方面 方式 内容 特点 区别 多样
Plain or complex:普通 普遍 正常 正式 基本 基本上 直接 复杂
Same and different:相同 同样 相反 相互 互相 共 共同
Explaining:说明 说明书 详细 举例 例子 例如 叫作

## Making changes|改变
Change:改 改变 适应 养成 成为 当 分为
Getting in:入 进入 加入 通 通过 出现 活动
Able to:能力 能够 无法 适合 面对 经历 经验
Start and stop:继续 进行 顺利 举行 举办 停止 暂停 取消
Using:使 使用 用于 用来 起到 作用 提供
Have, keep, lose:有着 现有 留 留下 待 存 积累 失去 放弃
Going up:增加 增长 强 加强 加上 超过 达到 高于
Going down:减 减少 减轻 降 降低 下降 低于 落

## Time and amount|将来
All:所有 一切 全 全部 全都 完全 整 整个
Each and any:各 各种 各个 各地 任何 另 另外
When:当时 目前 眼前 将来 今后 从此 之前 之后 等到
In order:首先 其次 接着 最终 顺序 再次 重新 重
Soon and suddenly:已 将 将要 忽然 暂时 同时 正好 巧
Very, even more:十分 更加 多么 尤其 大大 好好 实在
About, only, a bit:大约 至少 仅 仅仅 差点儿 稍 稍微
How often:平常 日常 往往 偶尔 少见 老是 从来 不断

## Little words|不过
But still:而 却 不过 然而 尽管 即使 仍 仍然
And also:与 并 并且 此外 再说 不仅 不光 甚至 连
So and if:由于 因此 于是 既 既然 否则 要是
Maybe, actually:也许 恐怕 竟然 就是 实际 实际上 真正 本来 原来
Whether or not:是否 能否 不管 无论 不论 难道 到底 究竟
According to:对于 按照 随着 作为 相比 自 由
Among and within:之 之间 之中 从中 其中 内 以内 此 此次
Have to, need not:无 不必 不得不 只好 不如 不便 便于
`,
  5: `
## Festival food|美味
Cooking:煮 炒 炸 烧 烧烤 燃烧 加热 切 冻
Taste and smell:口味 美味 酸甜苦辣 淡 浓 臭 咬
In the kitchen:锅 盖 盆 叉子 吸管 开水 洒 漏
Fruit and veg:蔬菜 土豆 番茄 黄瓜 玉米 桃 梨 橘子
Rice and tofu:主食 粮食 大米 豆腐 豆浆 饼 点心 盒饭
Eating out:餐饮 西餐 海鲜 火锅 酒吧 夜市 打包 醉
Eating well:饮食 食用 营养 热量 消化 胃 减肥 身材
On the label:成分 含 含有 含量 水分 保质期 过期 到期 无效

## At home|住房
A place to live:住房 房屋 公寓 宿舍 单元 居住 居民 住址
Rooms:卧室 书房 阳台 窗台 车库 台阶 墙 玻璃
In my room:柜子 书架 台灯 被子 床单 拖鞋 闹钟 扇子
Household things:家务 家电 电器 日用品 用品 物品 存放 玩具
At the door:主人 铃 响声 锁 扇 迎 迎接 接待 光临
Neighbourhood:社区 城区 胡同 大厦 广场 乡 乡村 故乡
Rent and repairs:住宿 租金 押金 中介 物业 装修 维修 安装

## Family and friends|亲人
Husband and wife:老公 老婆 太太 夫妇 新郎 新娘 婚礼 新人
People and ages:男子 女子 妇女 小姐 成人 成年 年纪 一代
Falling in love:恋爱 对象 亲爱 宝贝 拥抱 分手 失恋 离婚
Self and others:个人 本人 自身 私人 他人 双方 彼此 各自
Friend or stranger:伙伴 熟人 陌生 路人 人群 碰见 交往 相处
Family ties:亲 亲人 亲情 亲朋好友 陪伴 看望 想念 珍惜
Relatives:外公 外婆 姥爷 姥姥 大爷 大妈 子女 儿女
Goodbyes:告别 分别 分离 去世 舍得 舍不得 泪 眼泪 泪水

## Colours and shapes|色彩
Colours:黑 白 红 青 紫 灰 灰色 黄金
Bright and dark:色彩 彩色 五颜六色 丰富多彩 灯光 光线 光明 暗
Shapes:形状 圆 方 直 平 弯 斜 齐 整齐
Big and small:巨大 高大 大型 小型 广大 重大 伟大 强大
Wide, thin, soft:宽 窄 广 薄 浅 紧 软 硬 湿
Standing out:特殊 特色 特征 特有 独特 突出 个性
Style and looks:打扮 样式 风格 外形 外观 形象 优美 丑
Clothes:服装 西装 领带 系 牛仔裤 围巾 手套 口袋 套

## Body and health|人体
The body:人体 大脑 眼 嘴巴 牙齿 手指 腰 肌肉
Body language:脸色 表情 微笑 目光 反应 姿势 脚步 汗水
Getting sick:疾病 流感 着凉 过敏 疼痛 毛病 病情 伤
Treatment:治 治疗 医疗 医学 诊断 中医 中药 药物 药品
At the hospital:挂号 门诊 急诊 病房 救护车 抢救 救 手术
Strength:力 力量 用力 有力 大力 人力 体力 精力
Rest and recover:睡眠 失眠 熬夜 呼吸 恢复 好转 缓解
Good or bad for you:有益 有利 有助于 有害 不良 不利 伤害 损害 危害

## Animals and nature|生物
Animals:龙 猪 蛇 兔子 猴子 大象 鸭子 宠物
A flock, a bunch:群 匹 颗 根 朵 束 堆 团
On the farm:农业 农民 土地 浇 晒 收获 产量
Sky and weather:天空 天上 空中 雾 暴雨 雨水 地震 预报 升温
Living things:生物 生存 昆虫 虫子 蝴蝶 翅膀 尾巴
Land and water:湖 河流 陆地 山区 沙漠 沙子 石头 洞
Plants:树木 竹子 木头 玫瑰 种子 果实 生长 种植

## Getting around|一路顺风
On the way:一路 一路顺风 路线 行程 前往 到达 返回 停留
Where things are:位置 场所 中心 内部 外部 里头 当中 背后 四周
Regions:地区 区域 当地 本地 县 省会 欧洲 中外
Driving:驾驶 驾照 车辆 车主 行驶 超速 车祸 汽油
By train:铁路 列车 车厢 站台 乘务员 长途 往返 线路 开通
On foot:步行 行走 行人 迷路 通行 登 沿
Trips abroad:旅行社 游览 预订 预约 海关 海外 时差 飞行 飞行员

## Hands and feet|动手
With your hands:动手 抓 抢 握 握手 摸 抽 捡 摘
Chase and hide:追 冲 躲 藏 寻找 等待 等候 秘密
Break and lose:断 打断 碎 拆 破坏 损失 丢失
Slips and bumps:撞 碰 摔 滑 滚 翻 沉 低头 扶
Closer and further:移 移动 前进 退 退出 接近 靠近 距 前来
In the way:挡 堵 隔 划 围 绕 挤 闹
Up, down, around:上下 向上 地面 地下 表面 四处 空间 朝 面向
Reach, wave, pass:伸 挥 摇 递 传 传递 接收 领 领取

## Shops and money|买卖
Buying and selling:买卖 交易 出售 销售 销量 客户 商人 营业
Companies:企业 商业 商务 总部 行业 产业 开业 经营
Costs and profits:资金 成本 利润 利益 风险 保险 资源
Factories:工业 生产 产 产品 品 加工 制造 制作
Rich and poor:富 富有 穷 欠 赔 亏 捐 挣
Shopping:便利店 品牌 名牌 全新 二手 挑 挑选 消费 消费者
Shipping goods:货物 库 包装 配送 运 运输 进口 引进
At the bank:人民币 汇率 账户 存款 信用 税 花费 节省
Prices:售价 物价 涨 涨价 上涨 优惠 折扣 促销

## Festival traditions|传统
Good luck:福 恭喜 好运 幸运 运气 不幸 命 命运
Decorating:装饰 手工 工艺 气球 结 剪 剪刀 贴 插
Gifts and wishes:赠 赠送 赏 特产 宝 宝贵 珍贵 愿 愿望
On display:博物馆 展览 展出 展示 展现 展开 显示 体现
Legends:传说 神话 流传 神秘 生动 动人 奇迹 知名
Old traditions:古 古代 古老 悠久 近代 中华 中华民族 传统 风俗
Poems and painting:文学 经典 诗 诗人 书法 毛笔 国画 图画 美术
Holidays:除夕 元旦 国庆 年夜饭 压岁钱 纪念 纪念日 周年

## On stage|舞台
On stage:舞台 戏 戏剧 剧场 角色 导演 主持 嘉宾
Opening night:开幕 开幕式 闭幕式 现场 明星 魅力 届
Spreading the word:宣布 公布 发布 发表 宣传 推广 传播 普及
In the news:媒体 报道 采访 直播 电视台 收看 标题 出版 印刷
On record:录 录音 记录 记载 登记 保存 保留
Free time:休闲 业余 闲 户外 乐趣 欣赏 享受 迷
Films and photos:影片 影视 动画 纪录片 拍摄 摄影 合影 画面
Music and dance:歌曲 歌词 舞蹈 鼓 鼓掌 掌声 娱乐

## Sports and contests|冠军
The big match:选手 对手 裁判 赛场 比分 决赛 冠军
Win and lose:胜 胜利 领先 失误 挑战 敌人 激烈
Teamwork:团队 队伍 成员 集体 合作 配合 参与
Trying hard:争 争取 奋斗 拼 付出 投 投入 尽力 全力
Simply the best:奖励 称赞 实力 优势 出色 最佳 了不起
Reaching goals:追求 发挥 把握 实现 达成 成就 成果
Fast and slow:迅速 加速 缓慢 急忙 连忙 立即 立刻 尽快 抓紧
Track and field:训练 跑道 跳高 跳远 武术 纪录 打破

## School and study|学科
At school:幼儿园 学年 学分 学科 教材 图书 尺子 橡皮
Levels:级 初级 中级 高级 升级 超级 高档
Learning by doing:实践 实习 培训 尝试 试用 体验 体会
Exams:试卷 题目 填 测试 及格 录取 学历 证书 资格
Words and sounds:词汇 字母 读音 语音 语气 用法 念 比喻 形容
A good student:专心 勤奋 虚心 自觉 指导 改正 培养
Skills:技能 本领 能干 擅长 善于 熟练 掌握 长处 短处
At university:学术 学者 论文 讲座 写作 参考 提交 概括

## Work and jobs|就业
People at work:老板 员工 职工 秘书 主任 领导 专家 工程师 公务员
Plans and projects:项目 工程 方案 设计 制定 制订 调研 措施 手段
Getting it done:搞 行动 控制 执行 实施 实行 采取 开展 作出
Meetings:大会 召开 发起 出席 报告 发言 讲话 演讲 主席
Signing:签 签名 签字 签订 合同 协议 约定 甲 乙
Career moves:事业 从事 担任 辞职 离职 失业 退休 创业
Busy at work:劳动 人工 忙碌 负担 承担 效率 高效 业务
Getting hired:就业 简历 聘请 报到 待遇 名片 人才

## Computers and tech|高科技
Machines:机器 机器人 设备 设施 工具 电池 充电 电动 关闭
Smart tech:智能 高科技 新型 自动 功能 系统 数据 操作 设置
Making new things:发明 创造 创新 创作 开发 造 研发 研制
Build and found:建 建造 建设 建筑 修建 建立 成立 设立
Computers:计算机 屏幕 键 键盘 鼠标 硬件 软件 程序
Click and type:输入 下载 浏览 搜 搜索 复制 删 删除 更新
Online:网络 在线 登录 注册 账号 用户 平台 二维码 电子版
Putting to use:利用 运用 采用 应用 适用 实用 用途 便利

## Science and numbers|实验
In the lab:实验 实验室 试验 测 科研 观察 分析 结论
Cause and effect:令 使得 造成 导致 促使 因素 后果
How much:度 程度 强度 难度 角度 规模 范围 音量
Doing the sums:计算 统计 平均 比例 总共 总数 亿
Lots and few:无数 众多 大批 整整 将近 有限 无限
Sciences:物理 化学 地理 哲学 逻辑 理论 规律 物质 领域
Measuring:厘米 吨 长度 宽度 厚度 高度 深度 重量 面积

## Feelings|情绪
Good feelings:惊喜 期待 温暖 舒适 热爱 信任 尊敬 在乎
Moods:情绪 情感 心态 心理 精神 敏感 刺激 疯狂
The mind:意识 记忆 思维 智慧 思想 想象 思考
Calm and quiet:安 平安 静 平静 沉默 悄悄 安慰 同情
Being brave:勇气 敢于 大胆 坚强 决心 克服 忍 承受
Hard times:痛苦 遗憾 可怕 糟 糟糕 无奈 艰苦 不得了
Good-hearted:善良 真诚 亲切 热心 可靠 乐观 主动 灵活
Shy or silly:调皮 胆小 傻 怪 好奇 犹豫 谨慎 严肃 消极

## Talking it over|沟通
Chatting:谈话 话题 沟通 互动 表达 描述 讲述 提起
Names and meanings:称 称为 名称 标志 象征 主题 意味着 代表
Arguing and urging:吵 骂 抱怨 骗 劝 说服 催 强调
Agree or deny:承认 否认 否定 赞成 认 推荐 提倡
Relying on:靠 依靠 凭 凭借 据 依据 据说
Seeing it as:评 评价 反映 看作 视为 当作 当成
Asking:询问 提问 疑问 问卷 咨询 打听 请求 请教 访问
Post and phone:邮局 信封 邮票 包裹 拨打 占线 话费 留言 转告

## People and rules|规则
Government:政府 政治 总统 机构 组织 制度 改革 派
The people:人民 人类 人口 人物 市民 大众 老百姓 群体 族
What happened:事件 事故 意外 大事 现象 威胁 紧急
Rights and duties:权 权利 义务 自由 公平 地位 身份 贡献 志愿者
The law:法院 证据 合法 违法 违反 遵守 规则 原则 行为
Protect and prevent:保 守 爱护 防 防止 预防 避免 止
Police and fines:报警 保安 罚 罚款 手续 批准 限制 阻止

## Then, now, later|时代
Eras and stages:时代 年代 现代 时期 期间 阶段 初期 中期 早期
Back then:曾 曾经 从前 当年 早已 初 最初 原 原有
These days:如今 当前 今日 此时 时刻 近日 近期 近年来
Looking ahead:未来 前途 即将 预测 预计 长远 长期 短期 长久
Before and after:事先 此前 此后 随后 先后 自从 以来 至今
Holding steady:稳定 固定 平衡 保持 维持 持续 连续 延长 始终
Often or rarely:时常 通常 偶然 难得 从不 重复 反复 随时
Little by little:逐渐 渐渐 逐步 进一步 陆续 纷纷 首次
Calendar:日历 年初 季度 定期 临时 半夜 夜间 傍晚 早晚

## Big ideas|观点
Facts and reasons:事实 现实 真实 理由 道理 意义 价值 常识
Clear or vague:明显 显然 显得 明确 表明 具体 模糊
Kinds and types:类 类型 种类 品种 分类 式 形式 模式
How things stand:状态 状况 现状 形势 情景 背景 趋势 来源
The same:同 同一 一致 相似 类似 如同 相当
Points of view:观点 观念 概念 主观 客观 矛盾 细节
Good and proper:优质 优良 良好 完美 先进 好评 合理 适当
How it's built:结构 组成 构成 环节 事物 本质 性质 品质
Comparing:对比 较 相对 反 差别 差距 等于 大于 小于

## How things change|转变
Changing:化 转变 变动 形成 现代化 消失 成长 成熟
Joining up:合 配 结合 联合 组合 统一 连接
Gather and share:集 集中 集合 收集 分享 共享 分配 分布 排列
Making it better:改善 改进 完善 进步 提升 修改 调 调整
Deep and strong:深刻 深入 深远 深厚 广泛 强烈 热烈 弱
Too much:超 超出 过度 过分 过于 极其 格外 简直
Swap and refill:更换 交换 代 替 代替 补充 吸收 回收
More and less:升 上升 增 增强 增进 加深 扩大 缩小 缩短
Moving forward:推动 推进 促进 带动 发达 繁荣 开放

## Have and need|拥有
Having:拥有 具有 具备 属于 包括 包含 在内 占
Sure thing:确定 确认 确保 的确 必 必然 绝对
Being there:处 处于 位于 在于 存在 在场 出自
Full and complete:充满 充足 充分 足够 满足 完整 全面 彻底
Only one:唯一 单 单一 单独 独自 独立 一次性
Needs:需 需求 急需 必要 必需 应当 缺乏 不足
Close links:相关 无关 密切 紧密 接触 针对 围绕
Whole and part:全体 整体 总体 综合 其余 大多 个别
Dealing with:处理 面临 应对 对待 注重 讲究 忽视

## Little words|总之
Oh and ah:哦 呀 哈 唉 哎 哎呀 不要紧 没法儿
Formal little words:所 以 其 及 以及 至 便 某
Really and after all:居然 果然 反而 反正 毕竟 根本 依然
More counting words:支 副 架 批 伙 阵 册
Maybe and as if:或许 说不定 似乎 仿佛 似的 如 正如
How you do it:亲自 尽量 轻易 难以 随 随意 随手 顺 刚好
If and or:假如 万一 一旦 哪怕 不然 要不 要不是 或是
So and thus:从而 因而 由此 可见 总之 如此 如下 如何
`,
  6: `
## Body in motion|奔跑
Head and neck:脑袋 脑子 头脑 面部 眉毛 胡子 脖子 嗓子
Inside the body:心脏 肺 肝 肠 血液 血管 血压 神经
Body parts:胸 肩膀 手臂 骨头 颈椎 舌头 口腔 部位 一身
Looking:视觉 视力 近视 睁 闭 瞧 仰 回头
Push and pull:拖 抛 撒 扭 夹 撑 支撑
On the move:奔跑 闯 扑 闪 穿过 跟随 转身 使劲
On your feet:踩 迈 蹲 跪 跌 落地 后退 歇
With your hands:手势 招手 牵 捧 掏 拾 捉 携带

## Food and home|家常
Wow and whatever:啦 嘛 哇 嘿 得了 算了 也好 不成 无所谓
Pots and plates:盘 壶 罐 叉 盛 烫 电饭锅
Sauces and flour:酱 酱油 醋 辣椒 粉 面粉 奶粉 粒
Snacks:粥 香肠 花生 糖果 薯片 粽子 汤圆
Meals:用餐 套餐 自助 酒水 饮用水 酒精 品尝 家常 衣食住行
How it tastes:可口 口感 清淡 脆 烂 气味 变质
Clean up:清 清理 清洁 清洗 净 灰尘 晾
Around the house:住宅 隔壁 走廊 楼道 墙壁 浴室 枕头 自来水 通风
Heat and light:开关 电源 照明 灯笼 火柴 暖 暖气 热水器

## Family and looks|亲属
People:人家 人士 众人 大伙儿 同伴 个体 群众 民众
Getting married:婚姻 求婚 订婚 嫁 娶 夫人 喜事 团圆
Babies and children:怀孕 诞生 婴儿 娃娃 少儿 未成年人 青春 岁数
Family line:母 户 家家户户 千家万户 后代 继承 遗产 传承
Relatives:舅舅 姑姑 姨 媳妇 长辈 亲属 家属 老太太
Clothes and looks:内衣 背心 羽绒服 外表 样 模样 气质 笑容
Jewels and make-up:珠宝 珍珠 戒指 项链 耳环 香水 化妆 精致
Fashion:时尚 潮流 款式 新款 过时 模特儿 造型 搭配

## Health|康复
Call for help:求 求助 求救 救命 救援 救助 协助 互助
Feeling unwell:不适 晕 晕车 恶心 吐 吞 痒 肿
Falling ill:患 患者 症状 发病 发炎 炎症 伤口 损伤
Germs:病毒 细菌 感染 传染 传染病 免疫 消毒 防治
At the hospital:内科 外科 儿科 医药 服用 康复 急救
Body and mind:身心 强壮 发育 青春期 疲劳 减压 保健 按摩
Fat and hunger:肥 肥胖 脂肪 蛋白质 维生素 饥饿 食欲 胃口
Growing old:衰老 寿命 长寿 养老 养老院 残疾 轮椅 盲人

## Making and mending|针线
Dig and cut:挖 埋 钻 砍 割 刺 折
Cloth and thread:布 棉 皮 线 针 染 披
Stick and fasten:粘 粘贴 胶水 胶带 扣 扎 串 塞
Set up and cover:搭 摆 摆放 布置 铺 吊 覆盖
Mixing:混 混合 混乱 杂 融合 融入 分散
Drip and float:滴 泡 喷 淋 泼 浮 漂 飘
Metal, wood, stone:料 金属 金子 银 铜 砖 水泥 木材
Light and colour:黄 棕色 明亮 鲜明 鲜艳 影子 透 透过 透明

## Size and shape|尺寸
Shapes and curves:形态 圈 环 曲 弯曲 歪 尖 旋转 转动
Sides and ends:顶 端 侧 正面 跟前 内外 方位
Lines and gaps:横 竖 垂直 对称 均匀 间隔 密 密集 密度
Measure and test:测量 衡量 检测 检验 监测 验证 评估 考核
Units:尺 寸 尺寸 长短 毫米 毫升 平方 平方米
How much:体积 容量 幅度 比重 概率 频率 次数 数目
Adding up:总计 共计 人均 百分点 剩余 诸多 成千上万 番
Huge or moderate:庞大 宏大 广阔 遥远 中等 适度 极端 剧烈

## Land and weather|风雨
Fields and wells:田 土壤 肥沃 泥 沟 井 水库
Open country:野 野外 郊外 草原 大地 地域 地质 北极
Sea and shore:岛 岸 海岸 沿海 两岸 海面 海域 水面
Mountains:山顶 山峰 高峰 山坡 坡 高原 海拔 地形
Storms:雷 打雷 闪电 风雨 风力 彩虹 融化 保暖
Hot and cold:晴朗 炎热 严寒 常温 干燥 潮湿 湿度 干旱
Fire and flood:火灾 消防 点燃 洪水 淹 淹没 伤亡 伤员
Disasters:灾 灾难 灾害 灾区 受灾 救灾 旱灾 突发

## Earth and science|能源
Animals:狮子 狼 老鼠 蜜蜂 鲨鱼 野生 捕 钓鱼
Crops and flowers:庄稼 小麦 水稻 播种 丰收 梅花 菊花 枝 株
Life science:细胞 基因 遗传 进化 繁殖 培育 化石 有机
Fuel:能源 燃料 石油 煤 天然 天然气 消耗
Power:能量 电力 发电 太阳能 节能 再生 发光 低碳
Clean air:生态 绿化 污水 排放 噪声 氧气 二氧化碳 气体
Matter:物体 固体 液体 元素 合成 弹性 构造
Space and science:太空 月球 天文 轨道 科普 原理 效应

## Towns and roads|旅途
Town and village:镇 城镇 村庄 都市 州 一带 周边 街头
Buildings:栋 建筑物 塔 桥梁 工地 空地 栏 窗口
On the street:人行道 路面 路况 通道 管道 角落 拥挤 畅通
Wheels and ships:轮 轮子 货车 客车 轮船 船只 艘 航空
Driving:机动车 摩托车 刹车 倒车 拐 拐弯 碰撞 时速
Ports and borders:码头 港口 运送 托运 渡 出入 出境 入境
Journeys:旅途 旅程 路程 全程 起点 终点 抵达 远方
Sightseeing:出游 观光 观赏 游人 名胜 风光 景观 一帆风顺

## Games and glory|荣誉
Getting ahead:进展 进度 突破 超越 落后 挫折 成 成效 圆满
Drive:动力 活力 潜力 智力 力度 激励 鼓舞 激发
Talent:才能 才华 天才 特长 技巧 技艺 手法 高超 精通
Masters:大师 高手 师父 徒弟 杰出 优异 一流
Picking the best:竞赛 选拔 评选 筛选 入选 淘汰 考验
Chess and prizes:象棋 棋子 局 彩票 抽奖 中奖 奖品
Sports:体操 田径 跳水 滑雪 滑冰 棒球 台球 场地 场馆
Medals:奖牌 金牌 银牌 铜牌 亚军 季军 荣誉 排名

## Stage and screen|文艺
On screen:镜头 频道 录像 摄像 录制 播 字幕 图像
Actors:主角 主演 扮演 出场 艺人 偶像 排练 台风
Stories:剧本 情节 题材 喜剧 悲剧 童话 科幻 漫画
Publishing:版 版本 编 编辑 编写 改编 修订 印 发行
News:报社 报刊 访谈 专题 热点 论坛 稿子 稿件
Art and beauty:审美 美观 精美 图案 塑造 收藏 创意 新颖
Music:乐器 乐曲 演奏 歌唱 民歌 节奏 动听 古典
The arts:文艺 诗歌 散文 戏曲 相声 绘画 瓷器 园林

## School and study|学问
Books:书籍 著作 卷 章 目录 开头 结尾 简介
Read and write:书写 书面 抄 朗读 描写 描绘 叙述 口头
Learn by example:传授 示范 榜样 模仿 纠正 启发 启示 借鉴 吸取
Explaining:解 解答 解读 解说 讲解 比方 定义 含义
Research:探索 探讨 研讨 考察 考古 采集 搜集 课题
Extra lessons:导师 学员 辅导 补习 补课 夏令营 入门 学会
Going to school:念书 就读 升学 招生 名额 学位 初等 高等
Subjects:科 科目 文科 理科 专科 必修 选修 学问

## Work|岗位
Posts and duties:职位 职务 岗位 职责 事务 履行 值班 分工
The boss:总裁 主管 高层 上级 人事 指示 指定 调动
People at work:职员 白领 助理 助手 会计 顾问 同行 劳动力
Leading:率 率领 率先 带领 指挥 引导 主导
Planning:策略 策划 规划 决策 筹备 主办 承办 协调 监督
Hiring and pay:业 从业 求职 招 招收 用人 兼职 薪水 福利
Founding:立 创办 创立 创建 开设 开创 打造 树立 确立
Paper and pens:档案 文献 附件 图表 卡片 钢笔 文具

## Money|金钱
Rich and poor:财产 财富 财物 财务 资产 资本 富裕 贫困
Stocks:投资 基金 股票 股市 炒股 收益 亏损 上市
At the bank:储蓄 贷款 利息 汇 汇款 理财 金融 收取
Bills and cash:金钱 货币 金额 余额 账单 发票 券 支出
Paying back:补 补贴 补偿 赔偿 弥补 回报 归还 捐款 捐赠
Buy and sell:谈判 成交 订单 采购 收购 推销 畅销 转让
Companies:集团 厂商 厂家 运营 合并 破产 倒闭
Prices:定价 房价 代价 昂贵 贵重 实惠 性价比

## Goods and machines|贸易
Machines:机械 仪器 模型 模拟 故障 运行 启动 发动 开启
Phones and signals:通讯 通信 通话 热线 传真 麦克风 话筒 远程
Online:网 联网 浏览器 查询 扫描 定位 多媒体 人工智能 高新技术
Trade:贸易 经商 博览会 参展 委托 代理 专利 商标
Stock and supply:供应 供给 发放 配备 储存 备用 短缺 仓库
Flow:流动 流入 流通 流量 循环 输送 输出 传输
Making products:型号 性能 配套 保修 工序 步骤 流程
Materials:原料 原材料 农产品 制品 产地 国产 百货

## War and old kings|战争
War and peace:战争 和平 战斗 打仗 英雄 战胜 败 爆发
The army:军队 部队 兵 士兵 军人 将军 基地 命令
Weapons:武器 装备 枪 剑 箭 棍 射 射击
Attack:攻击 打击 冲击 爆 爆炸 灭 消灭
Seize and hold:夺 夺取 争夺 占据 占有 持有 对抗 抵抗 斗争
Fights and rows:冲突 对立 纠纷 争议 争论 争吵 吵架 打架
At the palace:国王 皇帝 公主 王子 宫 大臣 朝代 公元
Long ago:古人 祖先 后人 相传 文物 国宝 古迹 遗址

## Crime and rules|规矩
Poison and death:杀 自杀 死亡 毒 中毒 害 暴力
Thieves and cheats:偷 小偷儿 偷偷 骗子 欺骗 上当 犯 罪
Clues:线索 痕迹 脚印 跟踪 真相 证实 鉴定
Judge and jail:法官 公安 追究 惩罚 处罚 逃 逃跑 释放
Hiding:隐藏 隐私 躲避 避 暗示 默默 摆脱
Forced to obey:逼 强迫 被迫 勉强 自愿 肯 服 服从 听话
Rules:规矩 规范 正规 常规 纪律 秩序 有序
Allowed or not:不许 严禁 不宜 许可 法规 违规 例外
Limits:限 限于 限度 局限 制 约束 抑制 封闭 期限

## State and society|公民
Officials:官 官员 官方 中央 总理 大使 外交 联合国
Power and policy:权力 势力 政策 治理 推行 革命 解放
Votes and rights:投票 当选 上台 民主 公民 平等 公正 正义
In public:公 公开 公众 公告 公益 公认 启事
Clubs and groups:社 协会 团体 俱乐部 团结 聚集 号召
Rites and wishes:神 崇拜 仪式 典礼 宴会 祝福 祝愿 吉祥 拜年
Folk and custom:习俗 民俗 民间 文明 和谐 外界 外来 移民
Homeland:祖国 国旗 国歌 国情 本土 家园 天下 海内外

## Feelings|心愿
Fear and shock:吓 恐惧 不安 惊讶 惊人 大吃一惊 尴尬 为难
Love and hate:恨 愤怒 嫌 冲动 激情 心爱 好感 打动
Sad and lonely:悲伤 悲观 绝望 灰心 孤独 寂寞 可怜 委屈
Joy and pride:欢乐 痛快 趣味 迷人 自豪 感激 佩服
Worry:愁 发愁 担忧 焦虑 急切 不耐烦 在意 心疼
Hopes and longing:望 盼望 渴望 期望 向往 心愿 怀念 思念
The inner self:自我 心灵 心目 本能 欲望 动机 理性 认知
Views and beliefs:道德 立场 理 理念 信念 主张 思路 眼光

## Character and company|交际
Soft or tough:温柔 温和 严 严厉 狠 酷 坚定 坚决 顽强
Honest and modest:老实 诚信 单纯 天真 朴素 踏实 谦虚 高尚
Good and bad sides:细致 周到 马虎 大方 小气 呆 淘气
Hard-working:勤劳 用功 好学 下功夫 用心 专注 勇于 精心
Giving and caring:给予 赋予 奉献 关怀 关爱 顾 辅助 借助
Getting along:交际 打交道 往来 来往 亲密 信赖 依赖 赖
Visits and guests:拜访 会见 招待 好客 陪同 一同 一道 当面
How you see people:看待 看重 看中 看好 看得起 看不起 面子 嘲笑 逗
Praise and agree:夸 夸奖 夸张 赞赏 赞同 认可 认同 采纳

## Words and talk|言语
Talking:交谈 谈论 议论 评论 自言自语 实话 承诺
Ask and answer:征求 寻求 听取 倾听 答复 反馈 汇报 传达 提示
Blame and doubt:指责 警告 投诉 认错 质疑 疑惑 误 误解
Guess and expect:猜测 推测 预料 预期 预定 试图 不料
Know and tell apart:得知 识 识别 认定 区分 划分 忽略
Think it over:回顾 反思 感想 联想 幻想 设想 假设
Names and fame:命名 称呼 称作 称号 名气 出名 闻名 众所周知
Language:言语 母语 方言 声调 音节 成语 符号 口号 内涵

## Describing things|恰当
Clear or dark:清晰 清醒 显著 精确 纯 浓厚 黑暗
Hard and soft:坚硬 坚固 结实 牢 松 柔软 脆弱 薄弱
Strange and new:罕见 异常 神奇 妙 巧妙 崭新 新兴 原始 热门
What matters most:首要 至关重要 迫切 优先 特定 专用 通用 多余
Just right:恰当 适宜 可行 切实 健全 齐全 充实 地道
Hard going:艰难 艰辛 沉重 漫长 恶劣 难点 忍受 历经
Dull, busy, quick:枯燥 单调 平凡 活跃 繁忙 持久 快捷 便捷
Describing ideas:负面 片面 被动 间接 人为 抽象 多元 初步

## Ideas and links|关联
Scenes and moods:场合 场面 场景 景象 情形 局面 气氛 氛围
Cases and trends:案例 典型 教训 事项 举动 动态 倾向 前景
Links:关联 相连 涉及 伴随 贴近 属 归
Causes and origins:因 源于 起源 由来 引 引发 引入
The heart of it:核心 重心 焦点 实质 要点 要素 前提 主流
Systems and levels:体系 机制 途径 渠道 层次 层面 等级 类别 方方面面
Same or different:差异 相差 相等 同类 一模一样 对应 相应 系列 一系列
Pros and cons:缺陷 弱点 漏洞 用处 益处 功效 特性 素质

## Change and action|转换
In trouble:遭到 遭遇 遭受 陷入 丧失 危机 险 冒 冒险
Blocked:障碍 阻碍 妨碍 阻挡 拦 干扰 困扰 耽误 拖延
Clear away:除 排除 消除 撤销 拆除 散 散发
Shift and switch:转移 转换 转交 取代 过渡 调节 改造
Show and appear:露 透露 暴露 显 呈现 出示 涌现 兴起 生成
Fix and protect:修复 重建 还原 损坏 维护 保障 保管 巩固
More and stronger:添 添加 放大 扩展 延伸 延续 强化 加重 加剧
Less and simpler:减弱 压缩 简化 优化 中断 尽 免

## Time|岁月
A short while:瞬间 片刻 一阵 一时 此刻 当下 当场 工夫
Ages:一辈子 终身 岁月 时光 常年 当今 当代
Back then:当初 起初 原本 原先 先前 以往 往年 日前 近来
Later on:过后 事后 日后 往后 其间 前期 后期 周期
The right moment:时机 机遇 来临 趁 恰好 恰恰 总算 好容易
Day and night:凌晨 清晨 深夜 日夜 钟头 当天 定时 空闲
Again and again:一再 再三 接连 频繁 不时 不已 日益 轮流 一一
The calendar:年度 年终 上旬 中旬 下旬 截止 截至 延期 为期

## Little words|干脆
Why and because:为何 为此 为止 之所以 出于 多亏 至于
Never and not:未 未必 从未 不曾 毫无 毫不 不止 不至于
Even if, unless:虽 就算 即便 除非 要么 与其 不顾
So that:以便 以免 得以 足 足以 十足 加以 进而
Surely, simply:明明 无疑 算是 倒是 干脆 极为 特 看似
Formal words:于 则 凡是 本身 前者 后者 上述 犹如
Always and all:一向 一贯 依旧 仍旧 一律 大都 大致 处处 遍地
On purpose or not:特意 特地 白白 不禁 难免 只得 只顾
In a rush:匆匆 匆忙 赶忙 飞速 一口气 顿时 眼看
`,
};
