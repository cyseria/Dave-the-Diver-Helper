import { useNavigate } from "react-router-dom";
import { staffData, staffCombos } from "../data/staff";
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

/* ─── Per-role recommendation data ──────────────────────── */

interface RoleRec {
  role: string;
  emoji: string;
  label: string;
  color: string;
  lightColor: string;
  borderColor: string;
  keyNote: string;
  picks: {
    staffId: string;
    priority: number;
    reason: string;
  }[];
}

const ROLE_RECS: RoleRec[] = [
  {
    role: "manager",
    emoji: "🏅",
    label: "经理",
    color: "#92400e",
    lightColor: "#fef3c7",
    borderColor: "#d97706",
    keyNote: "料理 ≥ 500（解锁9级菜）、服务尽量高、少带技能（不抢跑堂做杂活）",
    picks: [
      { staffId: "drae",    priority: 1, reason: "唯一指定！料理 896 + 服务 855，自带清理+饮料，全场最优经理" },
      { staffId: "itsuki",  priority: 2, reason: "服务 932 极高，备选方案：料理 438 仅支持 8 级菜，分店可用" },
      { staffId: "billy",   priority: 3, reason: "清理达人经理可解放德瑞去主店，料理 408 仅支持 8 级菜" },
    ],
  },
  {
    role: "kitchen",
    emoji: "🍳",
    label: "后厨",
    color: "#9a3412",
    lightColor: "#fde8d8",
    borderColor: "#e87040",
    keyNote: "优先带特殊技能（食材处理达人/饮料制造达人），料理够用即可",
    picks: [
      { staffId: "raptor",   priority: 1, reason: "（实际后厨最优）饮料制造达人独一无二，全场所有饮料 +10 金" },
      { staffId: "james",    priority: 2, reason: "食材处理达人 10% 额外出餐，料理 800 够用" },
      { staffId: "maki",     priority: 3, reason: "免费获得 + 料理 1055，前期主力，后期可换下" },
      { staffId: "yone",     priority: 4, reason: "料理++ 满级 901，食材处理高手，后期顶尖后厨" },
      { staffId: "charlie",  priority: 5, reason: "料理 908，食材处理高手，性价比过渡选择" },
    ],
  },
  {
    role: "hall",
    emoji: "🛎️",
    label: "大堂",
    color: "#1e3a8a",
    lightColor: "#eff6ff",
    borderColor: "#3b82f6",
    keyNote: "必须凑齐清理 + 鸡尾酒/饮料 + 芥末，缺一不可",
    picks: [
      { staffId: "el-nino",  priority: 1, reason: "服务 986 全员最高，清理达人 + 饮料服务达人，大堂终极目标" },
      { staffId: "raptor",   priority: 2, reason: "服务 910，鸡尾酒 + 芥末技能完美补位" },
      { staffId: "itsuki",   priority: 3, reason: "服务 932，饮料技能，性价比极高，雇佣费仅 4 金" },
      { staffId: "billy",    priority: 4, reason: "清理达人 + 小费达人，前中期大堂首选" },
    ],
  },
  {
    role: "dispatch",
    emoji: "📦",
    label: "派遣",
    color: "#14532d",
    lightColor: "#f0fdf4",
    borderColor: "#22c55e",
    keyNote: "筹备达人 > 一切，派遣员工不占餐厅编制、随时待命",
    picks: [
      { staffId: "davina",     priority: 1, reason: "唯一真神！筹备 859 + 魅力 915 + 筹备达人，一次带回10+ 食材" },
      { staffId: "masayoshi",  priority: 2, reason: "筹备 814 + 筹备达人，双保险，与达比纳轮换" },
      { staffId: "liu",        priority: 3, reason: "筹备 780，适合派遣薅材料" },
    ],
  },
];

/* ─── Lineup plans ───────────────────────────────────────── */

interface LineupSlot {
  role: string;
  roleLabel: string;
  members: { staffId: string; note: string }[];
}

interface LineupPlan {
  id: string;
  name: string;
  emoji: string;
  tag: string;
  tagColor: string;
  description: string;
  mainStore: LineupSlot[];
  branch: LineupSlot[];
}

const LINEUP_PLANS: LineupPlan[] = [
  {
    id: "auto",
    name: "全自动挂机阵容",
    emoji: "🤖",
    tag: "戴夫全自动",
    tagColor: "#3b82f6",
    description: "戴夫无需亲自磨芥末、倒饮料，全员覆盖所有跑堂杂活，适合想专心潜水的玩家。",
    mainStore: [
      { role: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "el-nino", note: "清理达人 + 饮料" },
        { staffId: "raptor",  note: "鸡尾酒 + 芥末" },
      ]},
      { role: "kitchen", roleLabel: "🍳 后厨", members: [
        { staffId: "raptor", note: "← 同一人兼顾两列" },
        { staffId: "james",  note: "食材处理达人" },
      ]},
    ],
    branch: [
      { role: "manager", roleLabel: "🏅 经理", members: [
        { staffId: "drae", note: "清理 + 饮料全包" },
      ]},
      { role: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "itsuki", note: "饮料服务" },
      ]},
      { role: "kitchen", roleLabel: "🍳 后厨", members: [
        { staffId: "maki", note: "料理 1055" },
        { staffId: "yone", note: "食材处理高手" },
      ]},
    ],
  },
  {
    id: "manual",
    name: "戴夫磨芥末阵容",
    emoji: "💪",
    tag: "效率更高",
    tagColor: "#22c55e",
    description: "戴夫手动补芥末，解放猛禽空出主店，德瑞退守主店双清理，整体营收更高。",
    mainStore: [
      { role: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "el-nino", note: "清理达人 + 饮料" },
        { staffId: "drae",    note: "清理 + 饮料（双清理！）" },
      ]},
      { role: "kitchen", roleLabel: "🍳 后厨", members: [
        { staffId: "raptor", note: "饮料制造达人" },
        { staffId: "james",  note: "食材处理达人" },
      ]},
    ],
    branch: [
      { role: "manager", roleLabel: "🏅 经理", members: [
        { staffId: "itsuki", note: "服务 932，分店用" },
      ]},
      { role: "hall", roleLabel: "🛎️ 大堂", members: [
        { staffId: "raptor", note: "鸡尾酒 + 芥末" },
      ]},
      { role: "kitchen", roleLabel: "🍳 后厨", members: [
        { staffId: "maki", note: "料理 1055" },
        { staffId: "yone", note: "食材处理高手" },
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

        {/* ── 各岗位推荐 ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.headerRole}`}>
            <span className={styles.sectionEmoji}>🏆</span>
            <h2 className={styles.sectionTitle}>各岗位推荐</h2>
          </div>
          <div className={styles.roleGrid}>
            {ROLE_RECS.map((rec) => (
              <div key={rec.role} className={styles.roleCard}
                style={{ borderTopColor: rec.borderColor }}>
                <div className={styles.roleCardHeader}
                  style={{ background: rec.lightColor, borderBottomColor: `${rec.borderColor}60` }}>
                  <span className={styles.roleEmoji}>{rec.emoji}</span>
                  <span className={styles.roleLabel} style={{ color: rec.color }}>{rec.label}</span>
                </div>
                <div className={styles.roleKeyNote}>{rec.keyNote}</div>
                <div className={styles.rolePickList}>
                  {rec.picks.map((pick) => {
                    const s = staffData.find((x) => x.id === pick.staffId);
                    if (!s) return null;
                    return (
                      <div key={pick.staffId} className={styles.rolePickRow}>
                        <span className={styles.rolePickRank}
                          style={{ background: pick.priority === 1 ? rec.borderColor : "transparent",
                                   color: pick.priority === 1 ? "#fff" : rec.color,
                                   borderColor: rec.borderColor }}>
                          {pick.priority}
                        </span>
                        <span className={styles.rolePickEmoji}>{s.emoji}</span>
                        <div className={styles.rolePickBody}>
                          <span className={styles.rolePickName}>{s.name}</span>
                          <span className={styles.rolePickReason}>{pick.reason}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 阵容方案 ── */}
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
                      <div key={slot.role} className={styles.lineupSlot}>
                        <span className={styles.lineupSlotRole}>{slot.roleLabel}</span>
                        <div className={styles.lineupSlotMembers}>
                          {slot.members.map((m) => (
                            <StaffChip key={m.staffId} staffId={m.staffId} note={m.note} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.lineupStore}>
                    <div className={styles.lineupStoreTitle}>🏪 分店</div>
                    {plan.branch.map((slot) => (
                      <div key={slot.role} className={styles.lineupSlot}>
                        <span className={styles.lineupSlotRole}>{slot.roleLabel}</span>
                        <div className={styles.lineupSlotMembers}>
                          {slot.members.map((m) => (
                            <StaffChip key={m.staffId} staffId={m.staffId} note={m.note} />
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

        {/* ── 快捷搭配 (来自餐厅) ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles.headerCombo}`}>
            <span className={styles.sectionEmoji}>✨</span>
            <h2 className={styles.sectionTitle}>快捷搭配</h2>
          </div>
          <div className={styles.comboGrid}>
            {staffCombos.map((combo) => (
              <div key={combo.id} className={styles.comboCard}>
                <div className={styles.comboCardHeader}>
                  <span className={styles.comboEmoji}>{combo.emoji}</span>
                  <div>
                    <div className={styles.comboName}>{combo.name}</div>
                    <span className={styles.comboTag}>{combo.tag}</span>
                  </div>
                </div>
                <div className={styles.comboMembers}>
                  {combo.staffIds.map((sid) => (
                    <StaffChip key={sid} staffId={sid} />
                  ))}
                </div>
                <p className={styles.comboDesc}>{combo.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
