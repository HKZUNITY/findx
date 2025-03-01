import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["Id","Name","Value","Value_Ch","Value_Cht","Value_J","Value_K"],["","Key|ReadByName","MainLanguage","ChildLanguage","ChildLanguage","ChildLanguage","ChildLanguage"],[1,"CannotResetPositionWithinSeconds","Cannot Reset Position Within {0} Seconds","{0}秒内不可重置位置",null,null,null],[2,"DoYouWantToResetThePosition","Do You Want To Reset The Position","是否重置位置",null,null,null],[3,"Yes","Yes","是",null,null,null],[4,"No","No","否",null,null,null],[5,"ResetPosition","Reset Position","重置位置",null,null,null],[6,"DoYouWantToUseItImmediately","Do You Want To Use It Immediately","是否立即使用",null,null,null],[7,"Buy","Buy","购买",null,null,null],[8,"ConfirmExpenses","Confirm Expenses","确认花费",null,null,null],[9,"Diamonds","Diamonds","钻石",null,null,null],[10,"GoldCoins","Gold Coins","金币",null,null,null],[11,"Cancel","Cancel","取消",null,null,null],[12,"Tips","Tips","提示",null,null,null],[13,"AcquisitionFailedPleaseTryAgain","Acquisition Failed, Please Try Again","获取失败，请重试",null,null,null],[14,"FreeCollectionOfCoins","Free Collection Of {0} Coins","免费领取{0}金币",null,null,null],[15,"FreeToReceive","Free To Receive","免费领取",null,null,null],[16,"DoubleTheRewardMaximumHealthIncreasedTo","Double The Reward\nMaximum Health Increased To {0}","奖励翻倍\n最大生命值提高到{0}",null,null,null],[17,"FreeIncrease","Free Increase","免费提高",null,null,null],[18,"FreeUseOfOneRound","{0}\nFree Use Of One Round","{0}\n免费使用一局",null,null,null],[19,"FreeToUse","Free To Use","免费使用",null,null,null],[20,"FreeCollectionOfDiamonds","Free Collection Of {0} Diamonds","免费领取{0}钻石",null,null,null],[21,"Get","Get","获得",null,null,null],[22,"Spend","Spend","花费",null,null,null],[23,"Lurking","Lurkers","潜伏者",null,null,null],[24,"Defenders","Defenders","保卫者",null,null,null],[25,"Life","Hp","生命",null,null,null],[26,"InvincibleTime","Invincible Time","无敌时间",null,null,null],[27,"ResurrectionCountdown","Resurrection Countdown","复活倒计时",null,null,null],[28,"InvincibleWithinSecondsAfterResurrection","Invincible Within {0} Seconds After Resurrection","复活后{0}秒内无敌",null,null,null],[29,"SetUp","Set Up","设置",null,null,null],[30,"FiringSensitivity","Firing Sensitivity","开火灵敏度",null,null,null],[31,"ControlSensitivity","Control Sensitivity","控制灵敏度",null,null,null],[32,"BackgroundMusicSize","Background Music Size","背景音乐大小",null,null,null],[33,"SfxVolume","Sfx Volume","音效大小",null,null,null],[34,"Defeated"," Defeated "," 击败了 ",null,null,null],[35,"YouHaveBeenDefeatedBy","You Have Been Defeated By {0}","你已被 {0} 击败",null,null,null],[36,"DefeatToCompleteRevenge","Defeat {0} To Complete Revenge","击败 {0} 完成复仇",null,null,null],[37,"RdPlace","{0}: {1}Rd Place","{0}：第{1}名",null,null,null],[38,"DefeatedPeople_2","Defeated 2 People","连续消灭2人！势不可当！",null,null,null],[39,"DefeatedPeople_3","Defeated 3 People","连续消灭3人！勇冠三军！",null,null,null],[40,"DefeatedPeople_4","Defeated 4 People","连续消灭4人！无人能敌！",null,null,null],[41,"DefeatedPeople_5","Defeated 5 People","连续消灭5人！横扫千军！",null,null,null],[42,"DefeatedPeople_6","Defeated 6 People","连续消灭6人！接近神了！",null,null,null],[43,"DefeatedPeople_7","Defeated {0} People","连续消灭{0}人！超越神了！",null,null,null],[44,"Ranking","Ranking","排名",null,null,null],[45,"Nickname","Nickname","昵称",null,null,null],[46,"Beat","Beat","击败",null,null,null],[47,"Death","Death","死亡",null,null,null],[48,"TopInTheEntireServer","Top {0} In The Entire Server","全服前{0}名",null,null,null],[49,"TotalDefeat","Total Defeat","总击败",null,null,null],[50,"TotalDeaths","Total Deaths","总死亡",null,null,null],[51,"RankingOfAchievements","Ranking\nAchievements","战绩排行榜",null,null,null],[52,"FullServerRankingList","Full Server\nRanking List","全服排行榜",null,null,null],[53,"Weapon","Weapon","武器",null,null,null],[54,"Skin","Skin","皮肤",null,null,null],[55,"Trailing","Trailing","拖尾",null,null,null],[56,"Use","Use","使用",null,null,null],[57,"Obtained","Obtained","已获得",null,null,null],[58,"NotObtained","Not Obtained","未获得",null,null,null],[59,"Hurt","Hurt","伤害",null,null,null],[60,"Bullet","Bullet","子弹",null,null,null],[61,"TimeLimited","Time Limited","限时",null,null,null],[62,"Permanent","Permanent","永久",null,null,null],[63,"Error","Error","出错啦",null,null,null],[64,"TransformationStatusCannotOpenTheStore","Transformation Status Cannot Open The Store","变身状态不可打开商店",null,null,null],[65,"PurchaseSuccessful","Purchase Successful","购买成功",null,null,null],[66,"InsufficientGoldCoins","Insufficient Gold Coins","金币不足",null,null,null],[67,"DiamondShortage","Diamond Shortage","钻石不足",null,null,null],[68,"WearingIt","Wearing It","穿戴中",null,null,null],[69,"SkinSuccessfullyWorn","Skin Successfully Worn","皮肤成功穿戴",null,null,null],[70,"TailSuccessfullyWorn","Tail Successfully Worn","尾迹成功穿戴",null,null,null],[71,"Previewing","Previewing","正在预览",null,null,null],[72,"Pistol","Pistol","手枪",null,null,null],[73,"BubbleGun","Bubble Gun","泡泡枪",null,null,null],[74,"ShotgunSprayGun","Shotgun Spray Gun","散弹喷枪",null,null,null],[75,"Shotgun","Shotgun","霰弹枪",null,null,null],[76,"SpitfireGun","Spitfire Gun","喷火枪",null,null,null],[77,"FireGun","Fire Gun","火枪",null,null,null],[78,"LaserGun","Laser Gun","激光枪",null,null,null],[79,"WaterGun","Water Gun","水枪",null,null,null],[80,"RocketLauncher","Rocket Launcher","火箭发射器",null,null,null],[81,"JustinGatlin","Justin Gatlin","加特林",null,null,null],[82,"Tunas","Tunas","金枪鱼",null,null,null],[83,"BowAndArrow","Bow And Arrow","弓箭",null,null,null],[84,"ParticleTailing","Particle Tailing","粒子拖尾",null,null,null],[85,"SmokeTrail","Smoke Trail","烟雾拖尾",null,null,null],[86,"BeamTrailing","Beam Trailing","光束拖尾",null,null,null],[87,"Tail","Tail","拖尾",null,null,null],[88,"WaterTailing","Water Tailing","水拖尾",null,null,null],[89,"FlameTrailing","Flame Trailing","火焰拖尾",null,null,null],[90,"ThunderTail","Thunder Tail","雷拖尾",null,null,null],[91,"RainbowTail","Rainbow Tail","彩虹拖尾",null,null,null],[92,"TirePrintTailing","Tire Print Tailing","胎印拖尾",null,null,null],[93,"ScrewTail","Screw Tail","螺丝钉拖尾",null,null,null],[94,"FootballTail","Football Tail","足球拖尾",null,null,null],[95,"CandyTail","Candy Tail","糖果拖尾",null,null,null],[96,"TrophyTail","Trophy Tail","奖杯拖尾",null,null,null],[97,"CrownTail","Crown Tail","皇冠拖尾",null,null,null],[98,"LoveTail","Love Tail","爱心拖尾",null,null,null],[99,"SkullTail","Skull Tail","骷髅拖尾",null,null,null],[100,"BananaTail","Banana Tail","香蕉拖尾",null,null,null],[102,"SnowflakeTail","Snowflake Tail","雪花拖尾",null,null,null],[103,"Tail2023","2023 Tail","2023拖尾",null,null,null],[104,"FirecrackerTail","Firecracker Tail","爆竹拖尾",null,null,null],[105,"FireworksTail","Fireworks Tail","烟花拖尾",null,null,null],[106,"GiftTail","Gift Tail","礼物拖尾",null,null,null],[107,"TailOfBanknotes","Tail Of Banknotes","钞票拖尾",null,null,null],[108,"BubbleTail","Bubble Tail","泡泡拖尾",null,null,null],[109,"RibbonTrailing","Ribbon Trailing","彩带拖尾",null,null,null],[110,"TailOfFeces","Tail Of Feces","便便拖尾",null,null,null],[111,"MapleLeafTail","Maple Leaf Tail","枫叶拖尾",null,null,null],[112,"SixPointedStarTail","Six Pointed Star Tail","六芒星拖尾",null,null,null],[113,"ButterflyTail","Butterfly Tail","蝴蝶拖尾",null,null,null],[114,"IceCreamTrail","Ice Cream Trail","冰淇淋拖尾",null,null,null],[115,"BirdTail","Bird Tail","鸟拖尾",null,null,null],[116,"BatTail","Bat Tail","蝙蝠拖尾",null,null,null],[117,"XiangyunTail","Xiangyun Tail","祥云拖尾",null,null,null],[118,"Print","Print","爪印",null,null,null],[119,"HoodedMan","Hooded Man","兜帽男",null,null,null],[120,"DoublePonytailGirl","Double Ponytail Girl","双马尾女",null,null,null],[121,"MaleWarrior","Male Warrior","男战士",null,null,null],[122,"MechGirl","Mech Girl","机甲少女",null,null,null],[123,"MaleKnight","Male Knight","男骑士",null,null,null],[124,"NanoMechWomen","Nano Mech Women","纳米机甲女性",null,null,null],[125,"CyberYouth","Cyber Youth","赛博少年",null,null,null],[126,"CyberGirls","Cyber Girls","赛博少女",null,null,null],[127,"DefinitelyPotBoy","Definitely Pot Boy","一定锅少年",null,null,null],[128,"SeekingGodYoungMan","Seeking God, Young Man","求神少年",null,null,null],[129,"DefinitelyPotGirl","Definitely Pot Girl","一定锅少女",null,null,null],[130,"SeekingGodGirl","Seeking God Girl","求神少女",null,null,null],[131,"GemstoneArmoredMan","Gemstone Armored Man","宝石铠甲男",null,null,null],[132,"ArmoredMaleWarrior","Armored Male Warrior","铠甲男战士",null,null,null],[133,"BlackMaleNanomecha","Black Male Nanomecha","黑人男纳米机甲",null,null,null],[134,"WhiteMaleNanomecha","White Male Nanomecha","白人男纳米机甲",null,null,null],[135,"SilverKnights","Silver Knights","白银骑士",null,null,null],[136,"EagleWarrior","Eagle Warrior","鹰战士",null,null,null],[137,"Warrior","Warrior","战士",null,null,null],[138,"VenomMonster","Venom Monster","毒液怪人",null,null,null],[139,"AntWarrior","Ant Warrior","蚁侠士",null,null,null],[140,"TheStrongestCaptain","The Strongest Captain","最强队长",null,null,null],[141,"SuperHandsomeHero","Super Handsome Hero","超帅侠",null,null,null],[142,"StrangeWarrior","Strange Warrior","奇异战士",null,null,null],[143,"LightningMonster","Lightning Monster","闪电怪",null,null,null],[144,"EvilSpiritSkull","Evil Spirit Skull","恶灵骷髅",null,null,null],[145,"IronMan","Iron Man","铁人",null,null,null],[146,"WindbreakerGirl","Windbreaker Girl","风衣女",null,null,null],[147,"HanfuGirl","Hanfu Girl","汉服少女",null,null,null],[148,"FashionableGirl","Fashionable Girl","时尚少女",null,null,null],[149,"TrendyGirl","Trendy Girl","潮流少女",null,null,null],[150,"AncientScholars","Ancient Scholars","古代书生",null,null,null],[151,"OrangeLaserGun","Orange Laser Gun","橘黄激光枪",null,null,null],[152,"Text_ClaimRewards","Claim Rewards","领取奖励",null,null,null],[153,"Text_HangInTheAir","Hang In The Air","未完成",null,null,null],[154,"Text_DailyTasks","Daily Tasks","每日任务",null,null,null],[155,"Text_AllTasksHaveBeenCompletedWaitingForRefresh","All Tasks Have Been Completed, Waiting For Refresh","任务已全部完成，等待刷新...",null,null,null],[156,"Text_RemainingHours","Remaining: {0} Hours","剩余：{0}小时",null,null,null],[157,"Text_RemainingDays","Remaining: {0} Days","剩余：{0}天",null,null,null],[158,"Text_WeeklyTasks","Weekly Tasks","每周任务",null,null,null],[159,"Dailylogintothegame","Daily login to the game ({0}/{1})","每日登录游戏（{0}/{1}）",null,null,null],[160,"Dailyonlinedurationminutes","Daily online duration {2} minutes ({0}/{1})","每日在线时长{2}分钟（{0}/{1}）",null,null,null],[161,"Defeatplayersdaily","Defeat {2} players daily ({0}/{1})","每日击败{2}个玩家（{0}/{1}）",null,null,null],[162,"Logindaysperweek","Login {2} days per week ({0}/{1})","每周登录{2}天（{0}/{1}）",null,null,null],[163,"Join","Join","加入",null,null,null],[164,"WeaponEquipmentSuccessful","Weapon Equipment Successful","武器装备成功",null,null,null],[165,"SwitchingFailedYouAreAlreadyIn","Switching Failed, You Are Already In {0}","切换失败,你已在{0}中",null,null,null],[166,"CannotSwitchTeamsFrequentlyTryAgainInSeconds","Cannot Switch Teams Frequently, Try Again In {0} Seconds","不能频繁切换队伍，{0}秒后再试",null,null,null],[167,"SuccessfullySwitchedTeams","Successfully Switched Teams","切换队伍成功",null,null,null],[168,"SwitchingFailedThisTeamIsFull","Switching Failed, This Team Is Full","切换失败,此队已满",null,null,null],[169,"SwitchingFailedUnequalNumberOfPeople","Switching Failed, Unequal Number Of People","切换失败,人数不平等",null,null,null],[170,"AlreadyOnThisTeam","Already On This Team","已在此队",null,null,null],[171,"bazooka","bazooka","火箭筒",null,null,null],[172,"Text_TheItemBarIsFull","The item bar is full","道具栏已满",null,null,null],[173,"Text_ThisItemIsInUse","This item is in use","正在使用此道具",null,null,null],[174,"Text_Tips1","Someone is using it, please try another one","有人正在使用，请换个试试",null,null,null],[175,"Text_SetUp1","Base Setup","基础设置",null,null,null],[176,"Text_PictureQuality","Picture Quality","画质",null,null,null],[177,"Text_SoundEffects","Sound Effects","音效",null,null,null],[178,"Text_BackgroundMusic","Background Music","背景音乐",null,null,null],[179,"Text_ViewAngleScaling","View Angle Scaling","视角缩放",null,null,null],[180,"Text_DisplayNicknames","Display Nicknames","显示昵称",null,null,null],[181,"Text_ResetLocation","Reset Location","重置位置",null,null,null],[182,"Text_RestoringSettings","Restoring Settings","还原设置",null,null,null],[183,"Text_On","ON","开",null,null,null],[184,"Text_Off","OFF","关",null,null,null],[185,"Text_ObtainedTips","Obtained, open the knapsack to use","已获得，打开背包使用",null,null,null],[186,"Text_Advertising","Advertising","广告奖励",null,null,null],[187,"Text_ADGetTips","See the AD for free guide you get","看广告免费指引你获得",null,null,null],[188,"Text_Dont","Don't","不要",null,null,null],[189,"Text_Free","free","免费获得",null,null,null],[190,"Text_Fail","Fail","指引失败，请重试",null,null,null],[191,"Text_NoOnTheList","Not","未上榜",null,null,null],[192,"Text_Ranking","Ranking","排名",null,null,null],[193,"Text_Nickname","Nickname","昵称",null,null,null],[194,"Text_Score","Score","分数",null,null,null],[195,"Text_Duration","Duration","时长",null,null,null],[196,"Text_TopInTermsOfDuration","Top {0} In Terms Of Duration","时长全服前{0}名",null,null,null],[197,"Text_StartGame","Start the game","开始游戏",null,null,null],[198,"Text_WelcomeTo","Welcome to\nMy Cherry blossom town","欢迎来到\n我的樱花小镇",null,null,null],[199,"Text_UpNext","Up next","下一个",null,null,null],[200,"Text_GuideEnd","With the guide over, start your trip to the cherry blossom town","引导结束，开启你的樱花小镇之旅吧",null,null,null],[201,"Text_Close","Close","关闭",null,null,null],[202,"Text_MyCharacterId","My Character ID- Share Friend Try On","我的角色ID-分享好友试穿",null,null,null],[203,"Text_PleaseEnter","Please Enter The Friend Role ID","请输入好友角色ID",null,null,null],[204,"Text_Cancel","Cancel","取消",null,null,null],[205,"Text_FreeTryOn","Free Try On","免费试穿",null,null,null],[206,"Text_SaveImagesForFree","Save images for free","免费保存形象",null,null,null],[207,"Text_TryOnYourFriendAvatarForFree","Try On Your Friend's Avatar For Free","免费试穿好友的角色形象",null,null,null],[208,"Text_CopySuccessfully","Copy Successfully","复制成功",null,null,null],[209,"Text_InvalidID","Invalid ID!","ID无效！",null,null,null],[210,"Text_Loading","Loading","加载中",null,null,null],[211,"Text_TryItOnSuccessfully","Try it on successfully","试穿成功",null,null,null],[212,"Text_CopyTheCharacterIDShareFriendsTryOn","Copy the character ID share friends try on","复制角色ID分享好友试穿",null,null,null],[213,"Text_TryItOnForFree","Try it on for free","看广告免费试穿",null,null,null],[214,"Text_GuideTips","Reach near the target point","达到目标点附近",null,null,null],[215,"Text_HUDTips1",null,"签到任务",null,null,null],[216,"Text_HUDTips2",null,"排行榜",null,null,null],[217,"Text_HUDTips3",null,"设置",null,null,null],[218,"Text_HUDTips4",null,"换装商店",null,null,null],[219,"Text_HUDTips5",null,"武器商店",null,null,null],[220,"Text_HUDTips6",null,"切换阵营",null,null,null],[221,"Text_HUDTips7",null,"免费换装",null,null,null],[222,"Text_HUDTips8",null,null,null,null,null],[223,"Text_Tab1_1","Appearance","捏脸",null,null,null],[224,"Text_Tab1_2","Clothing","换装",null,null,null],[225,"Text_Tab1_3","Collection","收藏",null,null,null],[226,"Text_Tab1_4","Test","测试",null,null,null],[227,"Text_Tab2_101","Body Type","体型",null,null,null],[228,"Text_Tab2_102","Skin Tone","肤色",null,null,null],[229,"Text_Tab2_103","Face","脸型",null,null,null],[230,"Text_Tab2_104","Eyes","眼睛",null,null,null],[231,"Text_Tab2_105","Eyebrows","眉毛",null,null,null],[232,"Text_Tab2_106","Makeup","妆容",null,null,null],[233,"Text_Tab2_107","Expression","表情",null,null,null],[234,"Text_Tab2_108","Outfit","套装",null,null,null],[235,"Text_Tab2_109","Hair","头发",null,null,null],[236,"Text_Tab2_110","Top","上衣",null,null,null],[237,"Text_Tab2_111","Bottom","下衣",null,null,null],[238,"Text_Tab2_112","Gloves","鞋子",null,null,null],[239,"Text_Tab2_113","Shoes","手套",null,null,null],[240,"Text_Tab2_114","Pet","宠物",null,null,null],[241,"Text_Tab2_115","Accessory","饰品",null,null,null],[242,"Text_Tab2_501","Body Type","体型","收藏",null,null],[243,"Text_Tab2_502","Skin Tone","肤色","收藏",null,null],[244,"Text_Tab2_503","Face","脸型","收藏",null,null],[245,"Text_Tab2_504","Eyes","眼睛","收藏",null,null],[246,"Text_Tab2_505","Eyebrows","眉毛","收藏",null,null],[247,"Text_Tab2_506","Makeup","妆容","收藏",null,null],[248,"Text_Tab2_507","Expression","表情","收藏",null,null],[249,"Text_Tab2_508","Outfit","套装","收藏",null,null],[250,"Text_Tab2_509","Hair","头发","收藏",null,null],[251,"Text_Tab2_510","Top","上衣","收藏",null,null],[252,"Text_Tab2_511","Bottom","下衣","收藏",null,null],[253,"Text_Tab2_512","Gloves","鞋子","收藏",null,null],[254,"Text_Tab2_513","Shoes","手套","收藏",null,null],[255,"Text_Tab2_514","Pet","宠物","收藏",null,null],[256,"Text_Tab2_515","Accessory","饰品","收藏",null,null],[257,"Text_Tab3_1001","Pupil Style","瞳孔样式",null,null,null],[258,"Text_Tab3_1002","Lens","瞳孔贴花",null,null,null],[259,"Text_Tab3_1003","Upper Highlight","上高光",null,null,null],[260,"Text_Tab3_1004","Lower Highlight","下高光",null,null,null],[261,"Text_Tab3_1005","Eyelashes","睫毛",null,null,null],[262,"Text_Tab3_1006","Eyeshadow","眼影",null,null,null],[263,"Text_Tab3_1007","Blush","腮红",null,null,null],[264,"Text_Tab3_1008","Lip Makeup","口红",null,null,null],[265,"Text_Tab3_1009","Face Tattoo","面部彩绘",null,null,null],[266,"Text_Tab3_1010","Full Hair","整体发型",null,null,null],[267,"Text_Tab3_1011","Front Hair","前发",null,null,null],[268,"Text_Tab3_1012","Back Hair","后发",null,null,null],[269,"Text_Tab3_1013","Left Hand","左手",null,null,null],[270,"Text_Tab3_1014","Right Hand","右手",null,null,null],[271,"Text_Tab3_1015","Back","背饰",null,null,null],[272,"Text_Tab3_1016","Head","头饰",null,null,null],[273,"Text_Tab3_1017","Face","面饰",null,null,null],[274,"Text_Tab3_1018","Hip","臀部",null,null,null],[275,"Text_Tab3_1019","Shoulder","肩部",null,null,null],[276,"Text_Tab3_1020","Effects","特效",null,null,null],[277,"Text_Tab3_2001","Pupil Style","瞳孔样式","收藏",null,null],[278,"Text_Tab3_2002","Lens","瞳孔贴花","收藏",null,null],[279,"Text_Tab3_2003","Upper Highlight","上高光","收藏",null,null],[280,"Text_Tab3_2004","Lower Highlight","下高光","收藏",null,null],[281,"Text_Tab3_2005","Eyelashes","睫毛","收藏",null,null],[282,"Text_Tab3_2006","Eyeshadow","眼影","收藏",null,null],[283,"Text_Tab3_2007","Blush","腮红","收藏",null,null],[284,"Text_Tab3_2008","Lip Makeup","口红","收藏",null,null],[285,"Text_Tab3_2009","Face Tattoo","面部彩绘","收藏",null,null],[286,"Text_Tab3_2010","Full Hair","整体发型","收藏",null,null],[287,"Text_Tab3_2011","Front Hair","前发","收藏",null,null],[288,"Text_Tab3_2012","Back Hair","后发","收藏",null,null],[289,"Text_Tab3_2013","Left Hand","左手","收藏",null,null],[290,"Text_Tab3_2014","Right Hand","右手","收藏",null,null],[291,"Text_Tab3_2015","Back","背饰","收藏",null,null],[292,"Text_Tab3_2016","Ear","耳饰","收藏",null,null],[293,"Text_Tab3_2017","Face","面饰","收藏",null,null],[294,"Text_Tab3_2018","Hip","臀部","收藏",null,null],[295,"Text_Tab3_2019","Shoulder","肩部","收藏",null,null],[296,"Text_Tab3_2020","Effects","特效","收藏",null,null],[297,"Text_OpenClothTextBlock","Shop","换装商店",null,null,null],[298,"Text_MallItem_Free","Free","免费",null,null,null],[299,"Text_ThisFeatureIsNotEnabled","This feature is not enabled","此功能未开启",null,null,null],[300,"Text_BodyTypeDescribe","{0} times","{0}倍",null,null,null],[301,"Text_Expression_Default","Default","默认表情",null,null,null],[302,"Text_Expression_Smile","Smile","微笑",null,null,null],[303,"Text_Expression_HaveFun","Have Fun","开心",null,null,null],[304,"Text_Expression_Sad","Sad","伤心",null,null,null],[305,"Text_Expression_GetAngry","Get Angry","生气",null,null,null],[306,"Text_Expression_Embarrassment","Embarrassment","尴尬",null,null,null],[307,"Text_Expression_Laugh","Laugh","笑",null,null,null],[308,"Text_Expression_BeNaughty","Be Naughty","调皮",null,null,null],[309,"Text_Expression_Cute","Cute","可爱",null,null,null],[310,"Text_Expression_Doubt","Doubt","疑惑",null,null,null],[311,"Text_Tab3_1021","Trailing","拖尾",null,null,null],[312,"Text_Tab3_2021","Trailing","拖尾","收藏",null,null],[313,"Text_ColorPick","Color Pick","调色板",null,null,null],[314,"Text_ColorPart","Part {0}","部位 {0}",null,null,null],[315,"Text_NotSupportToning","This {0} Does Not Support Toning","这个{0}不支持调色",null,null,null],[316,"Text_PupilColor","Pupil Color","瞳孔颜色",null,null,null],[317,"Text_LeftPupilColor","Left Pupil Color","左瞳孔颜色",null,null,null],[318,"Text_RightPupilColor","Right Pupil Color","右瞳孔颜色",null,null,null],[319,"Text_DecalColor","Decal Color","贴花颜色",null,null,null],[320,"Text_UpperHighlightColor","Upper Highlight Color","上高光颜色",null,null,null],[321,"Text_LowerHighlightColor","Lower Highlight Color","下高光颜色",null,null,null],[322,"Text_EyelashColor","Eyelash Color","睫毛颜色",null,null,null],[323,"Text_EyeshaowColor","Eyeshaow Color","眼影颜色",null,null,null],[324,"Text_BlushColor","Blush Color","腮红颜色",null,null,null],[325,"Text_LipstickColor","Lipstick Color","口红颜色",null,null,null],[326,"Text_Monochrome","Monochrome","单色",null,null,null],[327,"Text_TopColor","Top Color","发顶色",null,null,null],[328,"Text_TailColor","Tail Color","发尾色",null,null,null],[329,"Text_FreeSave","Free Save","免费保存",null,null,null],[330,"Text_ResetImage","Reset Image","重置平台形象",null,null,null],[331,"Text_ResetImageFaild","Failed to reset platform image","重置平台形象失败",null,null,null],[332,"Text_SaveColor","Save {0} Color","保存{0}颜色",null,null,null],[333,"Text_SaveTips","Save Tips","保存提示",null,null,null],[334,"Text_Save","Save","保存",null,null,null],[335,"Text_NoSave","No Save","不保存",null,null,null],[336,"Text_WhetherSaveImage","Whether Save Image","是否保存当前角色形象",null,null,null],[337,"Text_CloseTips","Close Tips","关闭提示",null,null,null],[338,"Text_SaveSuccessfully","Save Successfully","保存成功",null,null,null],[339,"Text_ResetSuccessfully","Reset Successfully","重置成功",null,null,null],[340,"Text_SwitchSuccessfully","Switch Successfully","切换成功",null,null,null],[341,"Text_WhetherToKeepTheCurrentColor","Whether to keep the current color","是否保留当前颜色",null,null,null],[342,"Text_Retain","Retain","保留",null,null,null],[343,"Text_NoRetain","No Retain","不保留",null,null,null],[344,"Text_Tab3_1022","Daily Styling","日常造型1",null,null,null],[345,"Text_Tab3_1023","Muppet Styling","布偶造型",null,null,null],[346,"Text_Tab3_1024","Hero Styling","英雄造型",null,null,null],[347,"Text_Tab3_1025","Fantasy Modeling","幻想造型",null,null,null],[348,"Text_Tab3_1026","Holiday Styling","节日造型",null,null,null],[349,"Text_Tab3_1027","Science Fiction Styling","科幻造型",null,null,null],[350,"Text_Tab3_1028","Ancient Molding","古代造型",null,null,null],[351,"Text_Tab3_1029","Long Piece","长单件",null,null,null],[352,"Text_Tab3_1030","Jacket","短外套",null,null,null],[353,"Text_Tab3_1031","Short Piece","短单件",null,null,null],[354,"Text_Tab3_1032","Outfit","套装",null,null,null],[355,"Text_Tab3_1033","Long Coat","长外套",null,null,null],[356,"Text_Tab3_1034","Kilt","短裙",null,null,null],[357,"Text_Tab3_1035","Trousers","长裤",null,null,null],[358,"Text_Tab3_1036","Shorts","短裤",null,null,null],[359,"Text_Tab3_1037","Long Dress","长裙",null,null,null],[360,"Text_Tab3_1038","Pantyhose","裤袜",null,null,null],[361,"Text_Tab3_1039","Gloves","手套",null,null,null],[362,"Text_Tab3_1040","Glove Accessory","手套饰品",null,null,null],[363,"Text_Tab3_1041","Everyday Shoes","日常鞋",null,null,null],[364,"Text_Tab3_1042","Boots","靴子",null,null,null],[365,"Text_Tab3_1043","Toe Brace","足套",null,null,null],[366,"Text_Tab3_1044","Nudity","裸饰",null,null,null],[367,"Text_Tab3_1045","High Heeled Shoes","高跟鞋",null,null,null],[368,"Text_Tab3_1046","Sneakers","运动鞋",null,null,null],[369,"Text_Tab3_1047","Daily Styling","日常造型2",null,null,null]];
export interface ILanguageElement extends IElementBase{
 	/**唯一标识*/
	Id:number
	/**名字*/
	Name:string
	/**英文*/
	Value:string
 } 
export class LanguageConfig extends ConfigBase<ILanguageElement>{
	constructor(){
		super(EXCELDATA);
	}
	/**{0}秒内不可重置位置*/
	get CannotResetPositionWithinSeconds():ILanguageElement{return this.getElement(1)};
	/**是否重置位置*/
	get DoYouWantToResetThePosition():ILanguageElement{return this.getElement(2)};
	/**是*/
	get Yes():ILanguageElement{return this.getElement(3)};
	/**否*/
	get No():ILanguageElement{return this.getElement(4)};
	/**重置位置*/
	get ResetPosition():ILanguageElement{return this.getElement(5)};
	/**是否立即使用*/
	get DoYouWantToUseItImmediately():ILanguageElement{return this.getElement(6)};
	/**购买*/
	get Buy():ILanguageElement{return this.getElement(7)};
	/**确认花费*/
	get ConfirmExpenses():ILanguageElement{return this.getElement(8)};
	/**钻石*/
	get Diamonds():ILanguageElement{return this.getElement(9)};
	/**金币*/
	get GoldCoins():ILanguageElement{return this.getElement(10)};
	/**取消*/
	get Cancel():ILanguageElement{return this.getElement(11)};
	/**提示*/
	get Tips():ILanguageElement{return this.getElement(12)};
	/**获取失败，请重试*/
	get AcquisitionFailedPleaseTryAgain():ILanguageElement{return this.getElement(13)};
	/**免费领取{0}金币*/
	get FreeCollectionOfCoins():ILanguageElement{return this.getElement(14)};
	/**免费领取*/
	get FreeToReceive():ILanguageElement{return this.getElement(15)};
	/**奖励翻倍
最大生命值提高到{0}*/
	get DoubleTheRewardMaximumHealthIncreasedTo():ILanguageElement{return this.getElement(16)};
	/**免费提高*/
	get FreeIncrease():ILanguageElement{return this.getElement(17)};
	/**{0}
免费使用一局*/
	get FreeUseOfOneRound():ILanguageElement{return this.getElement(18)};
	/**免费使用*/
	get FreeToUse():ILanguageElement{return this.getElement(19)};
	/**免费领取{0}钻石*/
	get FreeCollectionOfDiamonds():ILanguageElement{return this.getElement(20)};
	/**获得*/
	get Get():ILanguageElement{return this.getElement(21)};
	/**花费*/
	get Spend():ILanguageElement{return this.getElement(22)};
	/**潜伏者*/
	get Lurking():ILanguageElement{return this.getElement(23)};
	/**保卫者*/
	get Defenders():ILanguageElement{return this.getElement(24)};
	/**生命*/
	get Life():ILanguageElement{return this.getElement(25)};
	/**无敌时间*/
	get InvincibleTime():ILanguageElement{return this.getElement(26)};
	/**复活倒计时*/
	get ResurrectionCountdown():ILanguageElement{return this.getElement(27)};
	/**复活后{0}秒内无敌*/
	get InvincibleWithinSecondsAfterResurrection():ILanguageElement{return this.getElement(28)};
	/**设置*/
	get SetUp():ILanguageElement{return this.getElement(29)};
	/**开火灵敏度*/
	get FiringSensitivity():ILanguageElement{return this.getElement(30)};
	/**控制灵敏度*/
	get ControlSensitivity():ILanguageElement{return this.getElement(31)};
	/**背景音乐大小*/
	get BackgroundMusicSize():ILanguageElement{return this.getElement(32)};
	/**音效大小*/
	get SfxVolume():ILanguageElement{return this.getElement(33)};
	/** 击败了 */
	get Defeated():ILanguageElement{return this.getElement(34)};
	/**你已被 {0} 击败*/
	get YouHaveBeenDefeatedBy():ILanguageElement{return this.getElement(35)};
	/**击败 {0} 完成复仇*/
	get DefeatToCompleteRevenge():ILanguageElement{return this.getElement(36)};
	/**{0}：第{1}名*/
	get RdPlace():ILanguageElement{return this.getElement(37)};
	/**连续消灭2人！势不可当！*/
	get DefeatedPeople_2():ILanguageElement{return this.getElement(38)};
	/**连续消灭3人！勇冠三军！*/
	get DefeatedPeople_3():ILanguageElement{return this.getElement(39)};
	/**连续消灭4人！无人能敌！*/
	get DefeatedPeople_4():ILanguageElement{return this.getElement(40)};
	/**连续消灭5人！横扫千军！*/
	get DefeatedPeople_5():ILanguageElement{return this.getElement(41)};
	/**连续消灭6人！接近神了！*/
	get DefeatedPeople_6():ILanguageElement{return this.getElement(42)};
	/**连续消灭{0}人！超越神了！*/
	get DefeatedPeople_7():ILanguageElement{return this.getElement(43)};
	/**排名*/
	get Ranking():ILanguageElement{return this.getElement(44)};
	/**昵称*/
	get Nickname():ILanguageElement{return this.getElement(45)};
	/**击败*/
	get Beat():ILanguageElement{return this.getElement(46)};
	/**死亡*/
	get Death():ILanguageElement{return this.getElement(47)};
	/**全服前{0}名*/
	get TopInTheEntireServer():ILanguageElement{return this.getElement(48)};
	/**总击败*/
	get TotalDefeat():ILanguageElement{return this.getElement(49)};
	/**总死亡*/
	get TotalDeaths():ILanguageElement{return this.getElement(50)};
	/**战绩排行榜*/
	get RankingOfAchievements():ILanguageElement{return this.getElement(51)};
	/**全服排行榜*/
	get FullServerRankingList():ILanguageElement{return this.getElement(52)};
	/**武器*/
	get Weapon():ILanguageElement{return this.getElement(53)};
	/**皮肤*/
	get Skin():ILanguageElement{return this.getElement(54)};
	/**拖尾*/
	get Trailing():ILanguageElement{return this.getElement(55)};
	/**使用*/
	get Use():ILanguageElement{return this.getElement(56)};
	/**已获得*/
	get Obtained():ILanguageElement{return this.getElement(57)};
	/**未获得*/
	get NotObtained():ILanguageElement{return this.getElement(58)};
	/**伤害*/
	get Hurt():ILanguageElement{return this.getElement(59)};
	/**子弹*/
	get Bullet():ILanguageElement{return this.getElement(60)};
	/**限时*/
	get TimeLimited():ILanguageElement{return this.getElement(61)};
	/**永久*/
	get Permanent():ILanguageElement{return this.getElement(62)};
	/**出错啦*/
	get Error():ILanguageElement{return this.getElement(63)};
	/**变身状态不可打开商店*/
	get TransformationStatusCannotOpenTheStore():ILanguageElement{return this.getElement(64)};
	/**购买成功*/
	get PurchaseSuccessful():ILanguageElement{return this.getElement(65)};
	/**金币不足*/
	get InsufficientGoldCoins():ILanguageElement{return this.getElement(66)};
	/**钻石不足*/
	get DiamondShortage():ILanguageElement{return this.getElement(67)};
	/**穿戴中*/
	get WearingIt():ILanguageElement{return this.getElement(68)};
	/**皮肤成功穿戴*/
	get SkinSuccessfullyWorn():ILanguageElement{return this.getElement(69)};
	/**尾迹成功穿戴*/
	get TailSuccessfullyWorn():ILanguageElement{return this.getElement(70)};
	/**正在预览*/
	get Previewing():ILanguageElement{return this.getElement(71)};
	/**手枪*/
	get Pistol():ILanguageElement{return this.getElement(72)};
	/**泡泡枪*/
	get BubbleGun():ILanguageElement{return this.getElement(73)};
	/**散弹喷枪*/
	get ShotgunSprayGun():ILanguageElement{return this.getElement(74)};
	/**霰弹枪*/
	get Shotgun():ILanguageElement{return this.getElement(75)};
	/**喷火枪*/
	get SpitfireGun():ILanguageElement{return this.getElement(76)};
	/**火枪*/
	get FireGun():ILanguageElement{return this.getElement(77)};
	/**激光枪*/
	get LaserGun():ILanguageElement{return this.getElement(78)};
	/**水枪*/
	get WaterGun():ILanguageElement{return this.getElement(79)};
	/**火箭发射器*/
	get RocketLauncher():ILanguageElement{return this.getElement(80)};
	/**加特林*/
	get JustinGatlin():ILanguageElement{return this.getElement(81)};
	/**金枪鱼*/
	get Tunas():ILanguageElement{return this.getElement(82)};
	/**弓箭*/
	get BowAndArrow():ILanguageElement{return this.getElement(83)};
	/**粒子拖尾*/
	get ParticleTailing():ILanguageElement{return this.getElement(84)};
	/**烟雾拖尾*/
	get SmokeTrail():ILanguageElement{return this.getElement(85)};
	/**光束拖尾*/
	get BeamTrailing():ILanguageElement{return this.getElement(86)};
	/**拖尾*/
	get Tail():ILanguageElement{return this.getElement(87)};
	/**水拖尾*/
	get WaterTailing():ILanguageElement{return this.getElement(88)};
	/**火焰拖尾*/
	get FlameTrailing():ILanguageElement{return this.getElement(89)};
	/**雷拖尾*/
	get ThunderTail():ILanguageElement{return this.getElement(90)};
	/**彩虹拖尾*/
	get RainbowTail():ILanguageElement{return this.getElement(91)};
	/**胎印拖尾*/
	get TirePrintTailing():ILanguageElement{return this.getElement(92)};
	/**螺丝钉拖尾*/
	get ScrewTail():ILanguageElement{return this.getElement(93)};
	/**足球拖尾*/
	get FootballTail():ILanguageElement{return this.getElement(94)};
	/**糖果拖尾*/
	get CandyTail():ILanguageElement{return this.getElement(95)};
	/**奖杯拖尾*/
	get TrophyTail():ILanguageElement{return this.getElement(96)};
	/**皇冠拖尾*/
	get CrownTail():ILanguageElement{return this.getElement(97)};
	/**爱心拖尾*/
	get LoveTail():ILanguageElement{return this.getElement(98)};
	/**骷髅拖尾*/
	get SkullTail():ILanguageElement{return this.getElement(99)};
	/**香蕉拖尾*/
	get BananaTail():ILanguageElement{return this.getElement(100)};
	/**雪花拖尾*/
	get SnowflakeTail():ILanguageElement{return this.getElement(102)};
	/**2023拖尾*/
	get Tail2023():ILanguageElement{return this.getElement(103)};
	/**爆竹拖尾*/
	get FirecrackerTail():ILanguageElement{return this.getElement(104)};
	/**烟花拖尾*/
	get FireworksTail():ILanguageElement{return this.getElement(105)};
	/**礼物拖尾*/
	get GiftTail():ILanguageElement{return this.getElement(106)};
	/**钞票拖尾*/
	get TailOfBanknotes():ILanguageElement{return this.getElement(107)};
	/**泡泡拖尾*/
	get BubbleTail():ILanguageElement{return this.getElement(108)};
	/**彩带拖尾*/
	get RibbonTrailing():ILanguageElement{return this.getElement(109)};
	/**便便拖尾*/
	get TailOfFeces():ILanguageElement{return this.getElement(110)};
	/**枫叶拖尾*/
	get MapleLeafTail():ILanguageElement{return this.getElement(111)};
	/**六芒星拖尾*/
	get SixPointedStarTail():ILanguageElement{return this.getElement(112)};
	/**蝴蝶拖尾*/
	get ButterflyTail():ILanguageElement{return this.getElement(113)};
	/**冰淇淋拖尾*/
	get IceCreamTrail():ILanguageElement{return this.getElement(114)};
	/**鸟拖尾*/
	get BirdTail():ILanguageElement{return this.getElement(115)};
	/**蝙蝠拖尾*/
	get BatTail():ILanguageElement{return this.getElement(116)};
	/**祥云拖尾*/
	get XiangyunTail():ILanguageElement{return this.getElement(117)};
	/**爪印*/
	get Print():ILanguageElement{return this.getElement(118)};
	/**兜帽男*/
	get HoodedMan():ILanguageElement{return this.getElement(119)};
	/**双马尾女*/
	get DoublePonytailGirl():ILanguageElement{return this.getElement(120)};
	/**男战士*/
	get MaleWarrior():ILanguageElement{return this.getElement(121)};
	/**机甲少女*/
	get MechGirl():ILanguageElement{return this.getElement(122)};
	/**男骑士*/
	get MaleKnight():ILanguageElement{return this.getElement(123)};
	/**纳米机甲女性*/
	get NanoMechWomen():ILanguageElement{return this.getElement(124)};
	/**赛博少年*/
	get CyberYouth():ILanguageElement{return this.getElement(125)};
	/**赛博少女*/
	get CyberGirls():ILanguageElement{return this.getElement(126)};
	/**一定锅少年*/
	get DefinitelyPotBoy():ILanguageElement{return this.getElement(127)};
	/**求神少年*/
	get SeekingGodYoungMan():ILanguageElement{return this.getElement(128)};
	/**一定锅少女*/
	get DefinitelyPotGirl():ILanguageElement{return this.getElement(129)};
	/**求神少女*/
	get SeekingGodGirl():ILanguageElement{return this.getElement(130)};
	/**宝石铠甲男*/
	get GemstoneArmoredMan():ILanguageElement{return this.getElement(131)};
	/**铠甲男战士*/
	get ArmoredMaleWarrior():ILanguageElement{return this.getElement(132)};
	/**黑人男纳米机甲*/
	get BlackMaleNanomecha():ILanguageElement{return this.getElement(133)};
	/**白人男纳米机甲*/
	get WhiteMaleNanomecha():ILanguageElement{return this.getElement(134)};
	/**白银骑士*/
	get SilverKnights():ILanguageElement{return this.getElement(135)};
	/**鹰战士*/
	get EagleWarrior():ILanguageElement{return this.getElement(136)};
	/**战士*/
	get Warrior():ILanguageElement{return this.getElement(137)};
	/**毒液怪人*/
	get VenomMonster():ILanguageElement{return this.getElement(138)};
	/**蚁侠士*/
	get AntWarrior():ILanguageElement{return this.getElement(139)};
	/**最强队长*/
	get TheStrongestCaptain():ILanguageElement{return this.getElement(140)};
	/**超帅侠*/
	get SuperHandsomeHero():ILanguageElement{return this.getElement(141)};
	/**奇异战士*/
	get StrangeWarrior():ILanguageElement{return this.getElement(142)};
	/**闪电怪*/
	get LightningMonster():ILanguageElement{return this.getElement(143)};
	/**恶灵骷髅*/
	get EvilSpiritSkull():ILanguageElement{return this.getElement(144)};
	/**铁人*/
	get IronMan():ILanguageElement{return this.getElement(145)};
	/**风衣女*/
	get WindbreakerGirl():ILanguageElement{return this.getElement(146)};
	/**汉服少女*/
	get HanfuGirl():ILanguageElement{return this.getElement(147)};
	/**时尚少女*/
	get FashionableGirl():ILanguageElement{return this.getElement(148)};
	/**潮流少女*/
	get TrendyGirl():ILanguageElement{return this.getElement(149)};
	/**古代书生*/
	get AncientScholars():ILanguageElement{return this.getElement(150)};
	/**橘黄激光枪*/
	get OrangeLaserGun():ILanguageElement{return this.getElement(151)};
	/**领取奖励*/
	get Text_ClaimRewards():ILanguageElement{return this.getElement(152)};
	/**未完成*/
	get Text_HangInTheAir():ILanguageElement{return this.getElement(153)};
	/**每日任务*/
	get Text_DailyTasks():ILanguageElement{return this.getElement(154)};
	/**任务已全部完成，等待刷新...*/
	get Text_AllTasksHaveBeenCompletedWaitingForRefresh():ILanguageElement{return this.getElement(155)};
	/**剩余：{0}小时*/
	get Text_RemainingHours():ILanguageElement{return this.getElement(156)};
	/**剩余：{0}天*/
	get Text_RemainingDays():ILanguageElement{return this.getElement(157)};
	/**每周任务*/
	get Text_WeeklyTasks():ILanguageElement{return this.getElement(158)};
	/**每日登录游戏（{0}/{1}）*/
	get Dailylogintothegame():ILanguageElement{return this.getElement(159)};
	/**每日在线时长{2}分钟（{0}/{1}）*/
	get Dailyonlinedurationminutes():ILanguageElement{return this.getElement(160)};
	/**每日击败{2}个玩家（{0}/{1}）*/
	get Defeatplayersdaily():ILanguageElement{return this.getElement(161)};
	/**每周登录{2}天（{0}/{1}）*/
	get Logindaysperweek():ILanguageElement{return this.getElement(162)};
	/**加入*/
	get Join():ILanguageElement{return this.getElement(163)};
	/**武器装备成功*/
	get WeaponEquipmentSuccessful():ILanguageElement{return this.getElement(164)};
	/**切换失败,你已在{0}中*/
	get SwitchingFailedYouAreAlreadyIn():ILanguageElement{return this.getElement(165)};
	/**不能频繁切换队伍，{0}秒后再试*/
	get CannotSwitchTeamsFrequentlyTryAgainInSeconds():ILanguageElement{return this.getElement(166)};
	/**切换队伍成功*/
	get SuccessfullySwitchedTeams():ILanguageElement{return this.getElement(167)};
	/**切换失败,此队已满*/
	get SwitchingFailedThisTeamIsFull():ILanguageElement{return this.getElement(168)};
	/**切换失败,人数不平等*/
	get SwitchingFailedUnequalNumberOfPeople():ILanguageElement{return this.getElement(169)};
	/**已在此队*/
	get AlreadyOnThisTeam():ILanguageElement{return this.getElement(170)};
	/**火箭筒*/
	get bazooka():ILanguageElement{return this.getElement(171)};
	/**道具栏已满*/
	get Text_TheItemBarIsFull():ILanguageElement{return this.getElement(172)};
	/**正在使用此道具*/
	get Text_ThisItemIsInUse():ILanguageElement{return this.getElement(173)};
	/**有人正在使用，请换个试试*/
	get Text_Tips1():ILanguageElement{return this.getElement(174)};
	/**基础设置*/
	get Text_SetUp1():ILanguageElement{return this.getElement(175)};
	/**画质*/
	get Text_PictureQuality():ILanguageElement{return this.getElement(176)};
	/**音效*/
	get Text_SoundEffects():ILanguageElement{return this.getElement(177)};
	/**背景音乐*/
	get Text_BackgroundMusic():ILanguageElement{return this.getElement(178)};
	/**视角缩放*/
	get Text_ViewAngleScaling():ILanguageElement{return this.getElement(179)};
	/**显示昵称*/
	get Text_DisplayNicknames():ILanguageElement{return this.getElement(180)};
	/**重置位置*/
	get Text_ResetLocation():ILanguageElement{return this.getElement(181)};
	/**还原设置*/
	get Text_RestoringSettings():ILanguageElement{return this.getElement(182)};
	/**开*/
	get Text_On():ILanguageElement{return this.getElement(183)};
	/**关*/
	get Text_Off():ILanguageElement{return this.getElement(184)};
	/**已获得，打开背包使用*/
	get Text_ObtainedTips():ILanguageElement{return this.getElement(185)};
	/**广告奖励*/
	get Text_Advertising():ILanguageElement{return this.getElement(186)};
	/**看广告免费指引你获得*/
	get Text_ADGetTips():ILanguageElement{return this.getElement(187)};
	/**不要*/
	get Text_Dont():ILanguageElement{return this.getElement(188)};
	/**免费获得*/
	get Text_Free():ILanguageElement{return this.getElement(189)};
	/**指引失败，请重试*/
	get Text_Fail():ILanguageElement{return this.getElement(190)};
	/**未上榜*/
	get Text_NoOnTheList():ILanguageElement{return this.getElement(191)};
	/**排名*/
	get Text_Ranking():ILanguageElement{return this.getElement(192)};
	/**昵称*/
	get Text_Nickname():ILanguageElement{return this.getElement(193)};
	/**分数*/
	get Text_Score():ILanguageElement{return this.getElement(194)};
	/**时长*/
	get Text_Duration():ILanguageElement{return this.getElement(195)};
	/**时长全服前{0}名*/
	get Text_TopInTermsOfDuration():ILanguageElement{return this.getElement(196)};
	/**开始游戏*/
	get Text_StartGame():ILanguageElement{return this.getElement(197)};
	/**欢迎来到
我的樱花小镇*/
	get Text_WelcomeTo():ILanguageElement{return this.getElement(198)};
	/**下一个*/
	get Text_UpNext():ILanguageElement{return this.getElement(199)};
	/**引导结束，开启你的樱花小镇之旅吧*/
	get Text_GuideEnd():ILanguageElement{return this.getElement(200)};
	/**关闭*/
	get Text_Close():ILanguageElement{return this.getElement(201)};
	/**我的角色ID-分享好友试穿*/
	get Text_MyCharacterId():ILanguageElement{return this.getElement(202)};
	/**请输入好友角色ID*/
	get Text_PleaseEnter():ILanguageElement{return this.getElement(203)};
	/**取消*/
	get Text_Cancel():ILanguageElement{return this.getElement(204)};
	/**免费试穿*/
	get Text_FreeTryOn():ILanguageElement{return this.getElement(205)};
	/**免费保存形象*/
	get Text_SaveImagesForFree():ILanguageElement{return this.getElement(206)};
	/**免费试穿好友的角色形象*/
	get Text_TryOnYourFriendAvatarForFree():ILanguageElement{return this.getElement(207)};
	/**复制成功*/
	get Text_CopySuccessfully():ILanguageElement{return this.getElement(208)};
	/**ID无效！*/
	get Text_InvalidID():ILanguageElement{return this.getElement(209)};
	/**加载中*/
	get Text_Loading():ILanguageElement{return this.getElement(210)};
	/**试穿成功*/
	get Text_TryItOnSuccessfully():ILanguageElement{return this.getElement(211)};
	/**复制角色ID分享好友试穿*/
	get Text_CopyTheCharacterIDShareFriendsTryOn():ILanguageElement{return this.getElement(212)};
	/**看广告免费试穿*/
	get Text_TryItOnForFree():ILanguageElement{return this.getElement(213)};
	/**达到目标点附近*/
	get Text_GuideTips():ILanguageElement{return this.getElement(214)};
	/**签到任务*/
	get Text_HUDTips1():ILanguageElement{return this.getElement(215)};
	/**排行榜*/
	get Text_HUDTips2():ILanguageElement{return this.getElement(216)};
	/**设置*/
	get Text_HUDTips3():ILanguageElement{return this.getElement(217)};
	/**换装商店*/
	get Text_HUDTips4():ILanguageElement{return this.getElement(218)};
	/**武器商店*/
	get Text_HUDTips5():ILanguageElement{return this.getElement(219)};
	/**切换阵营*/
	get Text_HUDTips6():ILanguageElement{return this.getElement(220)};
	/**免费换装*/
	get Text_HUDTips7():ILanguageElement{return this.getElement(221)};
	/**null*/
	get Text_HUDTips8():ILanguageElement{return this.getElement(222)};
	/**捏脸*/
	get Text_Tab1_1():ILanguageElement{return this.getElement(223)};
	/**换装*/
	get Text_Tab1_2():ILanguageElement{return this.getElement(224)};
	/**收藏*/
	get Text_Tab1_3():ILanguageElement{return this.getElement(225)};
	/**测试*/
	get Text_Tab1_4():ILanguageElement{return this.getElement(226)};
	/**体型*/
	get Text_Tab2_101():ILanguageElement{return this.getElement(227)};
	/**肤色*/
	get Text_Tab2_102():ILanguageElement{return this.getElement(228)};
	/**脸型*/
	get Text_Tab2_103():ILanguageElement{return this.getElement(229)};
	/**眼睛*/
	get Text_Tab2_104():ILanguageElement{return this.getElement(230)};
	/**眉毛*/
	get Text_Tab2_105():ILanguageElement{return this.getElement(231)};
	/**妆容*/
	get Text_Tab2_106():ILanguageElement{return this.getElement(232)};
	/**表情*/
	get Text_Tab2_107():ILanguageElement{return this.getElement(233)};
	/**套装*/
	get Text_Tab2_108():ILanguageElement{return this.getElement(234)};
	/**头发*/
	get Text_Tab2_109():ILanguageElement{return this.getElement(235)};
	/**上衣*/
	get Text_Tab2_110():ILanguageElement{return this.getElement(236)};
	/**下衣*/
	get Text_Tab2_111():ILanguageElement{return this.getElement(237)};
	/**鞋子*/
	get Text_Tab2_112():ILanguageElement{return this.getElement(238)};
	/**手套*/
	get Text_Tab2_113():ILanguageElement{return this.getElement(239)};
	/**宠物*/
	get Text_Tab2_114():ILanguageElement{return this.getElement(240)};
	/**饰品*/
	get Text_Tab2_115():ILanguageElement{return this.getElement(241)};
	/**体型*/
	get Text_Tab2_501():ILanguageElement{return this.getElement(242)};
	/**肤色*/
	get Text_Tab2_502():ILanguageElement{return this.getElement(243)};
	/**脸型*/
	get Text_Tab2_503():ILanguageElement{return this.getElement(244)};
	/**眼睛*/
	get Text_Tab2_504():ILanguageElement{return this.getElement(245)};
	/**眉毛*/
	get Text_Tab2_505():ILanguageElement{return this.getElement(246)};
	/**妆容*/
	get Text_Tab2_506():ILanguageElement{return this.getElement(247)};
	/**表情*/
	get Text_Tab2_507():ILanguageElement{return this.getElement(248)};
	/**套装*/
	get Text_Tab2_508():ILanguageElement{return this.getElement(249)};
	/**头发*/
	get Text_Tab2_509():ILanguageElement{return this.getElement(250)};
	/**上衣*/
	get Text_Tab2_510():ILanguageElement{return this.getElement(251)};
	/**下衣*/
	get Text_Tab2_511():ILanguageElement{return this.getElement(252)};
	/**鞋子*/
	get Text_Tab2_512():ILanguageElement{return this.getElement(253)};
	/**手套*/
	get Text_Tab2_513():ILanguageElement{return this.getElement(254)};
	/**宠物*/
	get Text_Tab2_514():ILanguageElement{return this.getElement(255)};
	/**饰品*/
	get Text_Tab2_515():ILanguageElement{return this.getElement(256)};
	/**瞳孔样式*/
	get Text_Tab3_1001():ILanguageElement{return this.getElement(257)};
	/**瞳孔贴花*/
	get Text_Tab3_1002():ILanguageElement{return this.getElement(258)};
	/**上高光*/
	get Text_Tab3_1003():ILanguageElement{return this.getElement(259)};
	/**下高光*/
	get Text_Tab3_1004():ILanguageElement{return this.getElement(260)};
	/**睫毛*/
	get Text_Tab3_1005():ILanguageElement{return this.getElement(261)};
	/**眼影*/
	get Text_Tab3_1006():ILanguageElement{return this.getElement(262)};
	/**腮红*/
	get Text_Tab3_1007():ILanguageElement{return this.getElement(263)};
	/**口红*/
	get Text_Tab3_1008():ILanguageElement{return this.getElement(264)};
	/**面部彩绘*/
	get Text_Tab3_1009():ILanguageElement{return this.getElement(265)};
	/**整体发型*/
	get Text_Tab3_1010():ILanguageElement{return this.getElement(266)};
	/**前发*/
	get Text_Tab3_1011():ILanguageElement{return this.getElement(267)};
	/**后发*/
	get Text_Tab3_1012():ILanguageElement{return this.getElement(268)};
	/**左手*/
	get Text_Tab3_1013():ILanguageElement{return this.getElement(269)};
	/**右手*/
	get Text_Tab3_1014():ILanguageElement{return this.getElement(270)};
	/**背饰*/
	get Text_Tab3_1015():ILanguageElement{return this.getElement(271)};
	/**头饰*/
	get Text_Tab3_1016():ILanguageElement{return this.getElement(272)};
	/**面饰*/
	get Text_Tab3_1017():ILanguageElement{return this.getElement(273)};
	/**臀部*/
	get Text_Tab3_1018():ILanguageElement{return this.getElement(274)};
	/**肩部*/
	get Text_Tab3_1019():ILanguageElement{return this.getElement(275)};
	/**特效*/
	get Text_Tab3_1020():ILanguageElement{return this.getElement(276)};
	/**瞳孔样式*/
	get Text_Tab3_2001():ILanguageElement{return this.getElement(277)};
	/**瞳孔贴花*/
	get Text_Tab3_2002():ILanguageElement{return this.getElement(278)};
	/**上高光*/
	get Text_Tab3_2003():ILanguageElement{return this.getElement(279)};
	/**下高光*/
	get Text_Tab3_2004():ILanguageElement{return this.getElement(280)};
	/**睫毛*/
	get Text_Tab3_2005():ILanguageElement{return this.getElement(281)};
	/**眼影*/
	get Text_Tab3_2006():ILanguageElement{return this.getElement(282)};
	/**腮红*/
	get Text_Tab3_2007():ILanguageElement{return this.getElement(283)};
	/**口红*/
	get Text_Tab3_2008():ILanguageElement{return this.getElement(284)};
	/**面部彩绘*/
	get Text_Tab3_2009():ILanguageElement{return this.getElement(285)};
	/**整体发型*/
	get Text_Tab3_2010():ILanguageElement{return this.getElement(286)};
	/**前发*/
	get Text_Tab3_2011():ILanguageElement{return this.getElement(287)};
	/**后发*/
	get Text_Tab3_2012():ILanguageElement{return this.getElement(288)};
	/**左手*/
	get Text_Tab3_2013():ILanguageElement{return this.getElement(289)};
	/**右手*/
	get Text_Tab3_2014():ILanguageElement{return this.getElement(290)};
	/**背饰*/
	get Text_Tab3_2015():ILanguageElement{return this.getElement(291)};
	/**耳饰*/
	get Text_Tab3_2016():ILanguageElement{return this.getElement(292)};
	/**面饰*/
	get Text_Tab3_2017():ILanguageElement{return this.getElement(293)};
	/**臀部*/
	get Text_Tab3_2018():ILanguageElement{return this.getElement(294)};
	/**肩部*/
	get Text_Tab3_2019():ILanguageElement{return this.getElement(295)};
	/**特效*/
	get Text_Tab3_2020():ILanguageElement{return this.getElement(296)};
	/**换装商店*/
	get Text_OpenClothTextBlock():ILanguageElement{return this.getElement(297)};
	/**免费*/
	get Text_MallItem_Free():ILanguageElement{return this.getElement(298)};
	/**此功能未开启*/
	get Text_ThisFeatureIsNotEnabled():ILanguageElement{return this.getElement(299)};
	/**{0}倍*/
	get Text_BodyTypeDescribe():ILanguageElement{return this.getElement(300)};
	/**默认表情*/
	get Text_Expression_Default():ILanguageElement{return this.getElement(301)};
	/**微笑*/
	get Text_Expression_Smile():ILanguageElement{return this.getElement(302)};
	/**开心*/
	get Text_Expression_HaveFun():ILanguageElement{return this.getElement(303)};
	/**伤心*/
	get Text_Expression_Sad():ILanguageElement{return this.getElement(304)};
	/**生气*/
	get Text_Expression_GetAngry():ILanguageElement{return this.getElement(305)};
	/**尴尬*/
	get Text_Expression_Embarrassment():ILanguageElement{return this.getElement(306)};
	/**笑*/
	get Text_Expression_Laugh():ILanguageElement{return this.getElement(307)};
	/**调皮*/
	get Text_Expression_BeNaughty():ILanguageElement{return this.getElement(308)};
	/**可爱*/
	get Text_Expression_Cute():ILanguageElement{return this.getElement(309)};
	/**疑惑*/
	get Text_Expression_Doubt():ILanguageElement{return this.getElement(310)};
	/**拖尾*/
	get Text_Tab3_1021():ILanguageElement{return this.getElement(311)};
	/**拖尾*/
	get Text_Tab3_2021():ILanguageElement{return this.getElement(312)};
	/**调色板*/
	get Text_ColorPick():ILanguageElement{return this.getElement(313)};
	/**部位 {0}*/
	get Text_ColorPart():ILanguageElement{return this.getElement(314)};
	/**这个{0}不支持调色*/
	get Text_NotSupportToning():ILanguageElement{return this.getElement(315)};
	/**瞳孔颜色*/
	get Text_PupilColor():ILanguageElement{return this.getElement(316)};
	/**左瞳孔颜色*/
	get Text_LeftPupilColor():ILanguageElement{return this.getElement(317)};
	/**右瞳孔颜色*/
	get Text_RightPupilColor():ILanguageElement{return this.getElement(318)};
	/**贴花颜色*/
	get Text_DecalColor():ILanguageElement{return this.getElement(319)};
	/**上高光颜色*/
	get Text_UpperHighlightColor():ILanguageElement{return this.getElement(320)};
	/**下高光颜色*/
	get Text_LowerHighlightColor():ILanguageElement{return this.getElement(321)};
	/**睫毛颜色*/
	get Text_EyelashColor():ILanguageElement{return this.getElement(322)};
	/**眼影颜色*/
	get Text_EyeshaowColor():ILanguageElement{return this.getElement(323)};
	/**腮红颜色*/
	get Text_BlushColor():ILanguageElement{return this.getElement(324)};
	/**口红颜色*/
	get Text_LipstickColor():ILanguageElement{return this.getElement(325)};
	/**单色*/
	get Text_Monochrome():ILanguageElement{return this.getElement(326)};
	/**发顶色*/
	get Text_TopColor():ILanguageElement{return this.getElement(327)};
	/**发尾色*/
	get Text_TailColor():ILanguageElement{return this.getElement(328)};
	/**免费保存*/
	get Text_FreeSave():ILanguageElement{return this.getElement(329)};
	/**重置平台形象*/
	get Text_ResetImage():ILanguageElement{return this.getElement(330)};
	/**重置平台形象失败*/
	get Text_ResetImageFaild():ILanguageElement{return this.getElement(331)};
	/**保存{0}颜色*/
	get Text_SaveColor():ILanguageElement{return this.getElement(332)};
	/**保存提示*/
	get Text_SaveTips():ILanguageElement{return this.getElement(333)};
	/**保存*/
	get Text_Save():ILanguageElement{return this.getElement(334)};
	/**不保存*/
	get Text_NoSave():ILanguageElement{return this.getElement(335)};
	/**是否保存当前角色形象*/
	get Text_WhetherSaveImage():ILanguageElement{return this.getElement(336)};
	/**关闭提示*/
	get Text_CloseTips():ILanguageElement{return this.getElement(337)};
	/**保存成功*/
	get Text_SaveSuccessfully():ILanguageElement{return this.getElement(338)};
	/**重置成功*/
	get Text_ResetSuccessfully():ILanguageElement{return this.getElement(339)};
	/**切换成功*/
	get Text_SwitchSuccessfully():ILanguageElement{return this.getElement(340)};
	/**是否保留当前颜色*/
	get Text_WhetherToKeepTheCurrentColor():ILanguageElement{return this.getElement(341)};
	/**保留*/
	get Text_Retain():ILanguageElement{return this.getElement(342)};
	/**不保留*/
	get Text_NoRetain():ILanguageElement{return this.getElement(343)};
	/**日常造型1*/
	get Text_Tab3_1022():ILanguageElement{return this.getElement(344)};
	/**布偶造型*/
	get Text_Tab3_1023():ILanguageElement{return this.getElement(345)};
	/**英雄造型*/
	get Text_Tab3_1024():ILanguageElement{return this.getElement(346)};
	/**幻想造型*/
	get Text_Tab3_1025():ILanguageElement{return this.getElement(347)};
	/**节日造型*/
	get Text_Tab3_1026():ILanguageElement{return this.getElement(348)};
	/**科幻造型*/
	get Text_Tab3_1027():ILanguageElement{return this.getElement(349)};
	/**古代造型*/
	get Text_Tab3_1028():ILanguageElement{return this.getElement(350)};
	/**长单件*/
	get Text_Tab3_1029():ILanguageElement{return this.getElement(351)};
	/**短外套*/
	get Text_Tab3_1030():ILanguageElement{return this.getElement(352)};
	/**短单件*/
	get Text_Tab3_1031():ILanguageElement{return this.getElement(353)};
	/**套装*/
	get Text_Tab3_1032():ILanguageElement{return this.getElement(354)};
	/**长外套*/
	get Text_Tab3_1033():ILanguageElement{return this.getElement(355)};
	/**短裙*/
	get Text_Tab3_1034():ILanguageElement{return this.getElement(356)};
	/**长裤*/
	get Text_Tab3_1035():ILanguageElement{return this.getElement(357)};
	/**短裤*/
	get Text_Tab3_1036():ILanguageElement{return this.getElement(358)};
	/**长裙*/
	get Text_Tab3_1037():ILanguageElement{return this.getElement(359)};
	/**裤袜*/
	get Text_Tab3_1038():ILanguageElement{return this.getElement(360)};
	/**手套*/
	get Text_Tab3_1039():ILanguageElement{return this.getElement(361)};
	/**手套饰品*/
	get Text_Tab3_1040():ILanguageElement{return this.getElement(362)};
	/**日常鞋*/
	get Text_Tab3_1041():ILanguageElement{return this.getElement(363)};
	/**靴子*/
	get Text_Tab3_1042():ILanguageElement{return this.getElement(364)};
	/**足套*/
	get Text_Tab3_1043():ILanguageElement{return this.getElement(365)};
	/**裸饰*/
	get Text_Tab3_1044():ILanguageElement{return this.getElement(366)};
	/**高跟鞋*/
	get Text_Tab3_1045():ILanguageElement{return this.getElement(367)};
	/**运动鞋*/
	get Text_Tab3_1046():ILanguageElement{return this.getElement(368)};
	/**日常造型2*/
	get Text_Tab3_1047():ILanguageElement{return this.getElement(369)};

}