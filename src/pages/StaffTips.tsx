import { useNavigate } from "react-router-dom";
import { staffData } from "../data/staff";
import styles from "./StaffTips.module.css";

/* ─── Skill Priority data ────────────────────────────────── */

interface SkillTier {
  tier: "S" | "A" | "B" | "C";
  skills: { name: string; note: string }[];
}

const KITCHEN_SKILLS: SkillTier[] = [
  {
    tier: "S",
    skills: [
      { name: "食材处理达人", note: "10% 概率额外出餐 — 实际收益远超料理属性加成" },
      { name: "饮料制造达人", note: "（拉乌尔专属）全场所有饮料 +10 金，独一无二" },
    ],
  },
  {
    tier: "A",
    skills: [
      { name: "食材处理高手", note: "5% 概率额外出餐，次优选择" },
    ],
  },
  {
    tier: "B",
    skills: [
      { name: "料理++", note: "仅影响出餐速度，够用即止（≥500 可制作 9 级菜品）" },
      { name: "料理+", note: "同上，优先级低" },
    ],
  },
];

const HALL_SKILLS: SkillTier[] = [
  {
    tier: "S",
    skills: [
      { name: "清理达人", note: "最关键！少一次清理直接流失客人，千金难买" },
    ],
  },
  {
    tier: "A",
    skills: [
      { name: "鸡尾酒服务", note: "高单价饮品，提升营收" },
      { name: "饮料服务达人", note: "同鸡尾酒，视菜单选一即可" },
      { name: "补充山葵", note: "免去戴夫手动磨芥末，解放操作" },
    ],
  },
  {
    tier: "B",
    skills: [
      { name: "小费达人", note: "锦上添花，聊胜于无" },
      { name: "服务+", note: "加走路速度，优先级低于功能性技能" },
    ],
  },
];

const DISPATCH_SKILLS: SkillTier[] = [
  {
    tier: "S",
    skills: [
      { name: "筹备达人", note: "派遣回来多拿指定食材，收益最直接" },
    ],
  },
  {
    tier: "A",
    skills: [
      { name: "魅力满分", note: "多拿随机食材，实用但不如达人稳定" },
    ],
  },
];

/* ─── 阵容方案：三套各岗位推荐（统一数据 + 阵容卡片样式）──────── */

interface PlanMember {
  staffId: string;
  skills: string[];
}

interface PlanSlot {
  roleLabel: string;
  roleKey: string;
  members: PlanMember[];
}

interface LineupPlan {
  id: string;
  name: string;
  emoji: string;
  tag: string;
  tagColor: string;
  description: string;
  mainStore: PlanSlot[];
  branch: PlanSlot[];
}

const LINEUP_PLANS: LineupPlan[] = [
  {
    id: "plan1",
    name: "方案1：全自动组合",
    emoji: "🤖",
    tag: "戴夫躺平流水线",
    tagColor: "#3b82f6",
    description: "旗舰店拉乌尔+詹姆斯后厨、埃尔尼诺+猛禽大堂；分店德瑞经理、真纪+米仓后厨、比利+杏子大堂。戴夫无需磨芥末倒饮料。",
    mainStore: [
      { roleKey: "kitchen", roleLabel: "🍳 厨房", members: [
        { staffId: "raoul", skills: ["饮料制造达人", "食材处理达人"] },
        { staffId: "james", skills: ["食材处理达人", "料理+"] },
      ]},
      { roleKey: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "el-nino", skills: ["清理达人", "饮料服务达人"] },
        { staffId: "raptor", skills: ["鸡尾酒服务", "补充山葵"] },
      ]},
    ],
    branch: [
      { roleKey: "manager", roleLabel: "🏅 分店经理", members: [
        { staffId: "drae", skills: ["鸡尾酒服务", "清理"] },
      ]},
      { roleKey: "kitchen", roleLabel: "🍳 厨房", members: [
        { staffId: "maki", skills: ["料理++", "料理+"] },
        { staffId: "yone", skills: ["食材处理高手", "料理++"] },
      ]},
      { roleKey: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "billy", skills: ["清理达人", "小费达人"] },
        { staffId: "kyoko", skills: ["小费达人", "饮料服务"] },
      ]},
    ],
  },
  {
    id: "plan2",
    name: "方案2：小费天团组合",
    emoji: "💵",
    tag: "戴夫芥末机管理员",
    tagColor: "#22c55e",
    description: "旗舰店拉乌尔+米仓后厨、埃尔尼诺+凯因大堂；分店德瑞经理、真纪+查理后厨、比利+杏子大堂。侧重小费与饮品。",
    mainStore: [
      { roleKey: "kitchen", roleLabel: "🍳 厨房", members: [
        { staffId: "raoul", skills: ["饮料制造达人", "食材处理达人"] },
        { staffId: "yone", skills: ["食材处理高手", "料理++"] },
      ]},
      { roleKey: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "el-nino", skills: ["清理达人", "饮料服务达人"] },
        { staffId: "cain", skills: ["鸡尾酒服务", "小费达人"] },
      ]},
    ],
    branch: [
      { roleKey: "manager", roleLabel: "🏅 分店经理", members: [
        { staffId: "drae", skills: ["鸡尾酒服务", "清理"] },
      ]},
      { roleKey: "kitchen", roleLabel: "🍳 厨房", members: [
        { staffId: "maki", skills: ["料理++", "料理+"] },
        { staffId: "charlie", skills: ["食材处理高手", "料理++"] },
      ]},
      { roleKey: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "billy", skills: ["清理达人", "小费达人"] },
        { staffId: "kyoko", skills: ["小费达人", "饮料服务"] },
      ]},
    ],
  },
  {
    id: "plan3",
    name: "方案3：双清理组合",
    emoji: "🧹",
    tag: "戴夫芥末机管理员",
    tagColor: "#8b5cf6",
    description: "旗舰店拉乌尔+米仓后厨、埃尔尼诺+德瑞大堂（双清理）；分店杏子经理、真纪+查理后厨、比利+凯因大堂。",
    mainStore: [
      { roleKey: "kitchen", roleLabel: "🍳 厨房", members: [
        { staffId: "raoul", skills: ["饮料制造达人", "食材处理达人"] },
        { staffId: "yone", skills: ["食材处理高手", "料理++"] },
      ]},
      { roleKey: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "el-nino", skills: ["清理达人", "饮料服务达人"] },
        { staffId: "drae", skills: ["鸡尾酒服务", "清理"] },
      ]},
    ],
    branch: [
      { roleKey: "manager", roleLabel: "🏅 分店经理", members: [
        { staffId: "kyoko", skills: ["小费达人", "饮料服务"] },
      ]},
      { roleKey: "kitchen", roleLabel: "🍳 厨房", members: [
        { staffId: "maki", skills: ["料理++", "料理+"] },
        { staffId: "charlie", skills: ["食材处理高手", "料理+"] },
      ]},
      { roleKey: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "billy", skills: ["清理达人", "小费达人"] },
        { staffId: "cain", skills: ["鸡尾酒服务", "小费达人"] },
      ]},
    ],
  },
];

/* ─── Sub-components ─────────────────────────────────────── */

function SkillTierRow({ tier }: { tier: SkillTier }) {
  const colors = {
    S: { bg: "#fde8d8", border: "#e87040", text: "#a03010", badge: "#e87040" },
    A: { bg: "#fef3c7", border: "#d97706", text: "#92400e", badge: "#d97706" },
    B: { bg: "#f5f5f5", border: "#aaa",    text: "#555",    badge: "#888"   },
    C: { bg: "#f5f5f5", border: "#ccc",    text: "#888",    badge: "#bbb"   },
  }[tier.tier];

  return (
    <div className={styles.skillTierRow} style={{ borderLeftColor: colors.badge }}>
      <span className={styles.skillTierBadge}
        style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text }}>
        {tier.tier}
      </span>
      <div className={styles.skillTierItems}>
        {tier.skills.map((s) => (
          <div key={s.name} className={styles.skillItem}>
            <span className={styles.skillName}>{s.name}</span>
            <span className={styles.skillNote}>{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffChip({ staffId, note }: { staffId: string; note?: string }) {
  const navigate = useNavigate();
  const s = staffData.find((x) => x.id === staffId);
  if (!s) return null;
  const roleColors = {
    kitchen:  { bg: "#fde8d8", border: "#e87040", text: "#9a3412" },
    hall:     { bg: "#eff6ff", border: "#60a5fa", text: "#1e3a8a" },
    dispatch: { bg: "#f0fdf4", border: "#4ade80", text: "#14532d" },
  }[s.role];

  return (
    <button
      type="button"
      className={styles.staffChip}
      style={{ background: roleColors.bg, borderColor: roleColors.border, color: roleColors.text }}
      onClick={() => navigate(`/staff/${s.id}`)}
      title={note}
    >
      <span>{s.emoji}</span>
      <span className={styles.chipName}>{s.name}</span>
      {note && <span className={styles.chipNote}>{note}</span>}
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────── */

export function StaffTips() {
  return (
    <div className={styles.outerPage}>
      <div className={styles.inner}>

        {/* ── 属性说明 ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.headerNote}`}>
            <span className={styles.sectionEmoji}>📊</span>
            <h2 className={styles.sectionTitle}>属性速查</h2>
          </div>
          <div className={styles.attrGrid}>
            {[
              { icon: "🍳", name: "料理", desc: "仅影响出餐速度；≥ 500 可制作 9 级菜品，多了溢出浪费" },
              { icon: "🛎️", name: "服务", desc: "跑堂走路速度，大堂员工越高越好" },
              { icon: "📦", name: "筹备", desc: "派遣时获取指定食材数量，派遣员工重点看此项" },
              { icon: "✨", name: "魅力", desc: "派遣时额外随机食材概率，实用性低于筹备" },
            ].map((a) => (
              <div key={a.name} className={styles.attrCard}>
                <span className={styles.attrIcon}>{a.icon}</span>
                <div>
                  <span className={styles.attrName}>{a.name}</span>
                  <p className={styles.attrDesc}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 阵容方案（三套各岗位推荐，阵容卡片样式 + StaffChip 交互）── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.headerLineup}`}>
            <span className={styles.sectionEmoji}>🤝</span>
            <h2 className={styles.sectionTitle}>阵容方案</h2>
          </div>
          <div className={styles.lineupGrid}>
            {LINEUP_PLANS.map((plan) => (
              <div key={plan.id} className={styles.lineupCard}>
                <div className={styles.lineupHeader}>
                  <span className={styles.lineupEmoji}>{plan.emoji}</span>
                  <div>
                    <div className={styles.lineupName}>{plan.name}</div>
                    <span className={styles.lineupTag}
                      style={{ background: `${plan.tagColor}22`, color: plan.tagColor, borderColor: plan.tagColor }}>
                      {plan.tag}
                    </span>
                  </div>
                </div>
                <p className={styles.lineupDesc}>{plan.description}</p>
                <div className={styles.lineupStores}>
                  <div className={styles.lineupStore}>
                    <div className={styles.lineupStoreTitle}>🏠 主店</div>
                    {plan.mainStore.map((slot) => (
                      <div key={slot.roleKey} className={styles.lineupSlot}>
                        <span className={styles.lineupSlotRole}>{slot.roleLabel}</span>
                        <div className={styles.lineupSlotMembers}>
                          {slot.members.map((m) => (
                            <StaffChip key={m.staffId} staffId={m.staffId} note={m.skills.join(" · ")} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.lineupStore}>
                    <div className={styles.lineupStoreTitle}>🏪 分店</div>
                    {plan.branch.map((slot) => (
                      <div key={slot.roleKey} className={styles.lineupSlot}>
                        <span className={styles.lineupSlotRole}>{slot.roleLabel}</span>
                        <div className={styles.lineupSlotMembers}>
                          {slot.members.map((m) => (
                            <StaffChip key={m.staffId} staffId={m.staffId} note={m.skills.join(" · ")} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 技能优先级 ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.headerSkill}`}>
            <span className={styles.sectionEmoji}>⚡</span>
            <h2 className={styles.sectionTitle}>技能优先级</h2>
          </div>
          <div className={styles.skillPriorityGrid}>
            <div className={styles.skillPriorityCard}>
              <div className={styles.skillCardTitle}>🍳 后厨技能</div>
              {KITCHEN_SKILLS.map((t) => <SkillTierRow key={t.tier} tier={t} />)}
            </div>
            <div className={styles.skillPriorityCard}>
              <div className={styles.skillCardTitle}>🛎️ 大堂技能</div>
              {HALL_SKILLS.map((t) => <SkillTierRow key={t.tier} tier={t} />)}
            </div>
            <div className={styles.skillPriorityCard}>
              <div className={styles.skillCardTitle}>📦 派遣技能</div>
              {DISPATCH_SKILLS.map((t) => <SkillTierRow key={t.tier} tier={t} />)}
              <div className={styles.tipCallout}>
                💡 经理自带饮料+芥末+清理基础技能，优先选料理≥500且服务高的员工
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
