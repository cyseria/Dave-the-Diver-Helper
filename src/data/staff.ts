import type { RestaurantTier, Staff } from "../types";

export interface StaffCombo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  staffIds: string[];
  tag: string; // e.g. "新手必备" / "效率最高"
}

export const staffData: Staff[] = [
  {
    id: "maki",
    name: "真纪",
    emoji: "👩‍🍳",
    role: "kitchen",
    tier: "S",
    hiringFee: 0,
    dailyWage: 25,
    recommendTip:
      "免费获得，料理属性满级高达 1055，双料理强化技能，全游戏最强后厨之一，无理由不培养。",
    description:
      "主线剧情解锁，料理天才，拥有双重料理强化技能，是前期最强后厨之一。",
    skills: [
      { level: 3, name: "料理+", description: "料理属性 +50", isDish: false },
      {
        level: 7,
        name: "料理++",
        description: "料理属性 +50（叠加）",
        isDish: false,
      },
      {
        level: 15,
        name: "鲑鱼子军舰",
        description: "解锁专属菜谱：鲑鱼子军舰",
        isDish: true,
      },
    ],
    maxStats: { cooking: 1055, serving: 33, procure: 20, appeal: 20 },
  },
  {
    id: "kyoko",
    name: "杏子",
    emoji: "🧑‍🍳",
    role: "hall",
    tier: "A",
    hiringFee: 0,
    dailyWage: 25,
    recommendTip: "剧情免费，服务与魅力兼顾，是前期大堂的稳定过渡选择。",
    description:
      "主线剧情解锁的大堂员工，综合属性均衡，服务与魅力兼顾，免费获得非常划算。",
    skills: [
      {
        level: 3,
        name: "饮料服务",
        description: "可以为顾客提供饮料服务",
        isDish: false,
      },
      {
        level: 7,
        name: "小费达人",
        description: "服务顾客后必定获得小费",
        isDish: false,
      },
      {
        level: 15,
        name: "鲣鱼散寿司",
        description: "解锁专属菜谱：鲣鱼散寿司",
        isDish: true,
      },
    ],
    maxStats: { cooking: 527, serving: 605, procure: 547, appeal: 838 },
  },
  {
    id: "itsuki",
    name: "树",
    emoji: "🧑",
    role: "hall",
    tier: "S",
    hiringFee: 4,
    dailyWage: 20,
    recommendTip:
      "雇佣费仅 4 金，满级服务 932 + 魅力 963，是性价比无敌的大堂员工，建议前期优先解锁。",
    description:
      "雇佣费仅4金，却拥有极高的服务与魅力属性，是性价比最高的大堂员工之一。",
    skills: [
      {
        level: 3,
        name: "饮料服务",
        description: "可以为顾客提供饮料服务",
        isDish: false,
      },
      {
        level: 7,
        name: "魅力十足",
        description: "魅力属性 +50",
        isDish: false,
      },
      {
        level: 15,
        name: "石鲈鱼寿司",
        description: "解锁专属菜谱：石鲈鱼寿司",
        isDish: true,
      },
    ],
    maxStats: { cooking: 438, serving: 932, procure: 628, appeal: 963 },
  },
  {
    id: "charlie",
    name: "查理",
    emoji: "👦",
    role: "kitchen",
    tier: "B",
    hiringFee: 123,
    dailyWage: 30,
    description: "低雇佣费的后厨员工，满级料理属性相当可观，适合前期快速培养。",
    skills: [
      { level: 3, name: "料理+", description: "料理属性 +50", isDish: false },
      {
        level: 7,
        name: "食材处理高手",
        description: "5% 概率增加出餐份数",
        isDish: false,
      },
      {
        level: 15,
        name: "辣炒鱿鱼",
        description: "解锁专属菜谱：辣炒鱿鱼",
        isDish: true,
      },
    ],
    maxStats: { cooking: 908, serving: 248, procure: 323, appeal: 129 },
  },
  {
    id: "liu",
    name: "柳",
    emoji: "👩",
    role: "dispatch",
    tier: "B",
    hiringFee: 125,
    dailyWage: 32,
    description:
      "筹备属性突出，适合常驻派遣，服务也不低，可作为过渡型全能员工。",
    skills: [
      {
        level: 3,
        name: "清洁",
        description: "可以清理桌面污渍",
        isDish: false,
      },
      { level: 7, name: "服务+", description: "服务属性 +50", isDish: false },
      {
        level: 15,
        name: "比目鱼押寿司",
        description: "解锁专属菜谱：比目鱼押寿司",
        isDish: true,
      },
    ],
    maxStats: { cooking: 550, serving: 455, procure: 780, appeal: 509 },
  },
  {
    id: "davina",
    name: "达比纳",
    emoji: "👩‍🦰",
    role: "dispatch",
    tier: "S",
    hiringFee: 143,
    dailyWage: 32,
    recommendTip:
      "筹备 859 + 魅力 915，筹备达人技能让派遣收益最大化，中后期分店店长的首选。",
    description: "筹备与魅力极高的派遣专精员工，满级后是分店店长的理想人选。",
    skills: [
      {
        level: 3,
        name: "魅力十足",
        description: "魅力属性 +50",
        isDish: false,
      },
      {
        level: 7,
        name: "筹备达人",
        description: "派遣时获得更多食材",
        isDish: false,
      },
      {
        level: 15,
        name: "河豚汤",
        description: "解锁专属菜谱：河豚汤",
        isDish: true,
      },
    ],
    maxStats: { cooking: 490, serving: 360, procure: 859, appeal: 915 },
  },
  {
    id: "drae",
    name: "德瑞",
    emoji: "🧔",
    role: "hall",
    tier: "S",
    hiringFee: 297,
    dailyWage: 45,
    recommendTip:
      "特殊员工，5/10/15 级均解锁专属菜谱，满级料理 896 + 服务 855，大堂与后厨皆可胜任，综合实力顶尖。",
    description:
      "特殊员工，5级、10级、15级均可解锁专属菜谱，料理与服务均衡，综合实力顶尖。",
    skills: [
      {
        level: 3,
        name: "清洁",
        description: "可以清理桌面污渍",
        isDish: false,
      },
      {
        level: 5,
        name: "泥蛤什锦饭",
        description: "解锁专属菜谱：泥蛤什锦饭",
        isDish: true,
      },
      {
        level: 7,
        name: "鸡尾酒服务",
        description: "可以为顾客调制并服务鸡尾酒",
        isDish: false,
      },
      {
        level: 10,
        name: "鸡尾酒拼盘",
        description: "解锁专属菜谱：鸡尾酒拼盘",
        isDish: true,
      },
      {
        level: 15,
        name: "黄油蒸蛤蜊",
        description: "解锁专属菜谱：黄油蒸蛤蜊",
        isDish: true,
      },
    ],
    maxStats: { cooking: 896, serving: 855, procure: 666, appeal: 744 },
  },
  {
    id: "masayoshi",
    name: "正义",
    emoji: "👨‍💼",
    role: "dispatch",
    tier: "A",
    hiringFee: 551,
    dailyWage: 65,
    recommendTip:
      "料理 786 + 筹备 814 双高，可灵活担任后厨或派遣，中期最均衡的多功能员工。",
    description:
      "料理与筹备双高，可担任后厨或派遣，是中期最均衡的多功能员工之一。",
    skills: [
      {
        level: 3,
        name: "食材处理高手",
        description: "5% 概率增加出餐份数",
        isDish: false,
      },
      {
        level: 7,
        name: "筹备达人",
        description: "派遣时获得更多食材",
        isDish: false,
      },
      {
        level: 15,
        name: "石鲈鱼天妇罗",
        description: "解锁专属菜谱：石鲈鱼天妇罗",
        isDish: true,
      },
    ],
    maxStats: { cooking: 786, serving: 253, procure: 814, appeal: 378 },
  },
  {
    id: "billy",
    name: "比利",
    emoji: "👱",
    role: "hall",
    tier: "A",
    hiringFee: 562,
    dailyWage: 60,
    recommendTip:
      "清理达人 + 小费达人双保险，让大堂几乎不需要戴夫插手，前中期大堂首选。",
    description:
      "清理达人 + 小费达人双技能，大堂效率极高，前中期大堂首选之一。",
    skills: [
      {
        level: 3,
        name: "清理达人",
        description: "以更快速度清理桌面污渍",
        isDish: false,
      },
      {
        level: 7,
        name: "小费达人",
        description: "服务顾客后必定获得小费",
        isDish: false,
      },
      {
        level: 15,
        name: "绯红鱼卷",
        description: "解锁专属菜谱：绯红鱼卷",
        isDish: true,
      },
    ],
    maxStats: { cooking: 408, serving: 723, procure: 467, appeal: 291 },
  },
  {
    id: "james",
    name: "詹姆斯",
    emoji: "🎭",
    role: "kitchen",
    tier: "B",
    hiringFee: 707,
    dailyWage: 70,
    description:
      "恐怖面具造型的后厨高手，料理与筹备均衡，食材处理达人有概率额外增加出餐量。",
    skills: [
      { level: 3, name: "料理+", description: "料理属性 +50", isDish: false },
      {
        level: 7,
        name: "食材处理达人",
        description: "10% 概率增加出餐份数",
        isDish: false,
      },
      {
        level: 15,
        name: "凉拌水母",
        description: "解锁专属菜谱：凉拌水母",
        isDish: true,
      },
    ],
    maxStats: { cooking: 800, serving: 225, procure: 482, appeal: 269 },
  },
  {
    id: "raptor",
    name: "猛禽",
    emoji: "🦅",
    role: "hall",
    tier: "A",
    hiringFee: 1150,
    dailyWage: 90,
    recommendTip:
      "同为特殊员工（5/10/15 级均解锁菜谱），鸡尾酒服务可大幅提升饮品营收，筹备 770 兼顾派遣价值。",
    description:
      "特殊大堂员工，服务与筹备俱佳，鸡尾酒服务技能让餐厅饮品收益大幅提升。",
    skills: [
      {
        level: 3,
        name: "补充山葵",
        description: "可自动为寿司台补充山葵",
        isDish: false,
      },
      {
        level: 5,
        name: "秋刀鱼盐烤",
        description: "解锁专属菜谱：秋刀鱼盐烤",
        isDish: true,
      },
      {
        level: 7,
        name: "鸡尾酒服务",
        description: "可以为顾客调制并服务鸡尾酒",
        isDish: false,
      },
      {
        level: 10,
        name: "甜虾握寿司",
        description: "解锁专属菜谱：甜虾握寿司",
        isDish: true,
      },
      {
        level: 15,
        name: "烤章鱼串",
        description: "解锁专属菜谱：烤章鱼串",
        isDish: true,
      },
    ],
    maxStats: { cooking: 304, serving: 910, procure: 770, appeal: 194 },
  },
  {
    id: "tohoku",
    name: "东北",
    emoji: "👨‍🍳",
    role: "kitchen",
    tier: "A",
    hiringFee: 1307,
    dailyWage: 95,
    recommendTip:
      "料理 739 + 魅力 808，双强化技能后出餐速度可观，是真纪之外的优质后厨选择。",
    description:
      "双料理强化技能，魅力属性意外地高，综合实力突出，是前中期后厨的可靠之选。",
    skills: [
      { level: 3, name: "料理+", description: "料理属性 +50", isDish: false },
      {
        level: 7,
        name: "料理++",
        description: "料理属性 +50（叠加）",
        isDish: false,
      },
      {
        level: 15,
        name: "大蒜烤热带鱼",
        description: "解锁专属菜谱：大蒜烤热带鱼",
        isDish: true,
      },
    ],
    maxStats: { cooking: 739, serving: 99, procure: 155, appeal: 808 },
  },
  {
    id: "yone",
    name: "米仓",
    emoji: "🧑‍🍳",
    role: "kitchen",
    tier: "S",
    hiringFee: 1464,
    dailyWage: 100,
    recommendTip:
      "料理++ 技能提供 +100 加成，满级料理 901，出餐效率顶尖，后期后厨毕业之选。",
    description:
      "顶级后厨员工，料理++ 提供超高料理加成，料理属性满级高达901，派遣也不弱。",
    skills: [
      { level: 3, name: "料理++", description: "料理属性 +100", isDish: false },
      {
        level: 5,
        name: "星斑河豚冻",
        description: "解锁专属菜谱：星斑河豚冻",
        isDish: true,
      },
      {
        level: 7,
        name: "食材处理高手",
        description: "5% 概率增加出餐份数",
        isDish: false,
      },
      {
        level: 15,
        name: "海马海草沙拉",
        description: "解锁专属菜谱：海马海草沙拉",
        isDish: true,
      },
    ],
    maxStats: { cooking: 901, serving: 154, procure: 385, appeal: 126 },
  },
  {
    id: "el-nino",
    name: "埃尔尼诺",
    emoji: "🕺",
    role: "hall",
    tier: "S",
    hiringFee: 2327,
    dailyWage: 120,
    recommendTip:
      "服务 986 全员最高，饮料服务达人 + 清理达人双技能，配齐后戴夫几乎无需亲自跑堂，大堂终极目标。",
    description:
      "服务属性最高的大堂员工，饮料服务达人 + 清理达人双技能，让戴夫几乎无需亲自跑堂。",
    skills: [
      {
        level: 3,
        name: "饮料服务达人",
        description: "完美为顾客提供饮料服务",
        isDish: false,
      },
      {
        level: 5,
        name: "金枪鱼鱼汤",
        description: "解锁专属菜谱：金枪鱼鱼汤",
        isDish: true,
      },
      {
        level: 7,
        name: "清理达人",
        description: "以更快速度清理桌面污渍",
        isDish: false,
      },
      {
        level: 15,
        name: "乌鳢石斑鱼排",
        description: "解锁专属菜谱：乌鳢石斑鱼排",
        isDish: true,
      },
    ],
    maxStats: { cooking: 126, serving: 986, procure: 425, appeal: 138 },
  },
  {
    id: "chitose",
    name: "千岁",
    emoji: "👸",
    role: "kitchen",
    tier: "S",
    hiringFee: 2917,
    dailyWage: 150,
    recommendTip:
      "DLC 限定，四维属性均超 700，是游戏中最全能的员工，无论放在哪个岗位都表现出色。",
    description:
      "DLC 付费员工，四维属性均衡且极高，是游戏中最全能的员工，但雇佣费用不菲。",
    skills: [
      { level: 3, name: "料理+", description: "料理属性 +50", isDish: false },
      {
        level: 7,
        name: "料理+",
        description: "料理属性 +100（叠加）",
        isDish: false,
      },
      {
        level: 15,
        name: "黑松露鲑鱼",
        description: "解锁专属菜谱：黑松露鲑鱼",
        isDish: true,
      },
    ],
    maxStats: { cooking: 876, serving: 726, procure: 726, appeal: 726 },
  },
];

export const staffCombos: StaffCombo[] = [
  {
    id: "starter",
    name: "开局三件套",
    emoji: "🌱",
    tag: "新手必备",
    staffIds: ["maki", "kyoko", "davina"],
    description:
      "真纪主厨保障出餐速度，杏子跑堂服务顾客，达比纳派遣稳定食材供应——三人全部免费或极低费用获得，是最省钱的开局配置。",
  },
  {
    id: "hall-master",
    name: "跑堂解放套",
    emoji: "🛎️",
    tag: "效率最高",
    staffIds: ["maki", "itsuki", "el-nino"],
    description:
      "树 + 埃尔尼诺双大堂覆盖饮料服务与清理，戴夫几乎可以专心潜水。真纪坐镇后厨，三人分工明确，黄金餐厅阶段首选。",
  },
  {
    id: "all-star",
    name: "全明星阵容",
    emoji: "👑",
    tag: "后期终极",
    staffIds: ["yone", "el-nino", "drae", "davina"],
    description:
      "米仓顶级后厨，埃尔尼诺满编大堂，德瑞兼顾前后厅还解锁三张菜谱，达比纳负责派遣与分店。四人齐聚后餐厅进入自动运营状态。",
  },
  {
    id: "cocktail",
    name: "饮品营收套",
    emoji: "🍹",
    tag: "金币最多",
    staffIds: ["maki", "raptor", "drae", "davina"],
    description:
      "猛禽 + 德瑞均具备鸡尾酒服务技能，配合高售价饮品菜谱可大幅提升单晚营收。达比纳派遣持续补充调酒所需食材。",
  },
];

export const restaurantTiers: RestaurantTier[] = [
  {
    id: "bronze",
    name: "青铜",
    emoji: "🥉",
    color: "#cd7f32",
    normalSeats: 14,
    nightSeats: null,
    hallStaff: 1,
    kitchenStaff: 1,
  },
  {
    id: "silver",
    name: "白银",
    emoji: "🥈",
    color: "#9ea0a3",
    normalSeats: 20,
    nightSeats: 12,
    hallStaff: 2,
    kitchenStaff: 1,
  },
  {
    id: "gold",
    name: "黄金",
    emoji: "🥇",
    color: "#e8a800",
    normalSeats: 28,
    nightSeats: 17,
    hallStaff: 2,
    kitchenStaff: 2,
  },
  {
    id: "platinum",
    name: "白金",
    emoji: "💠",
    color: "#9b80d0",
    normalSeats: 36,
    nightSeats: 24,
    hallStaff: 2,
    kitchenStaff: 2,
  },
  {
    id: "diamond",
    name: "钻石",
    emoji: "💎",
    color: "#58c8e8",
    normalSeats: 45,
    nightSeats: 30,
    hallStaff: 2,
    kitchenStaff: 2,
  },
];
