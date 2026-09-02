"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CloudCog,
  Cpu,
  Database,
  Download,
  FileClock,
  Gauge,
  Grid2X2,
  HardDrive,
  LayoutDashboard,
  Leaf,
  ListChecks,
  Menu,
  Network,
  PanelLeftClose,
  Play,
  Plus,
  RefreshCw,
  Route,
  Search,
  ServerCog,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  SquareStack,
  StopCircle,
  Workflow,
  X,
  Zap
} from "lucide-react";

const managedCenters = [
  {
    id: "DC-ZJ-HZ-01",
    name: "杭州数据中心",
    region: "浙江",
    type: "算力中心",
    controlPlatform: "电信云霆",
    controlStatus: "正常",
    compute: "2.1 PFLOPS",
    taskLoad: "0.22 MW",
    status: "在线"
  },
  {
    id: "DC-ZJ-NB-02",
    name: "宁波数据中心",
    region: "浙江",
    type: "算力中心",
    controlPlatform: "电信云霆",
    controlStatus: "正常",
    compute: "1.1 PFLOPS",
    taskLoad: "0.12 MW",
    status: "在线"
  },
  {
    id: "DC-GS-QY-01",
    name: "庆阳算力集群",
    region: "甘肃",
    type: "算力集群",
    controlPlatform: "电信云霆",
    controlStatus: "正常",
    compute: "3.6 PFLOPS",
    taskLoad: "0.61 MW",
    status: "在线"
  },
  {
    id: "DC-GS-LZ-02",
    name: "兰州数据中心",
    region: "甘肃",
    type: "算力中心",
    controlPlatform: "电信云霆",
    controlStatus: "正常",
    compute: "1.2 PFLOPS",
    taskLoad: "0.21 MW",
    status: "在线"
  },
  {
    id: "DC-BJ-YZ-01",
    name: "亦庄算力节点",
    region: "北京",
    type: "算力节点",
    controlPlatform: "联通星罗",
    controlStatus: "正常",
    compute: "3.0 PFLOPS",
    taskLoad: "0.16 MW",
    status: "在线"
  },
  {
    id: "DC-BJ-HD-02",
    name: "海淀计算中心",
    region: "北京",
    type: "算力中心",
    controlPlatform: "联通星罗",
    controlStatus: "正常",
    compute: "2.1 PFLOPS",
    taskLoad: "0.12 MW",
    status: "在线"
  },
  {
    id: "DC-LF-KF-01",
    name: "廊坊开发区数据中心",
    region: "廊坊",
    type: "算力中心",
    controlPlatform: "联通星罗",
    controlStatus: "正常",
    compute: "4.5 PFLOPS",
    taskLoad: "0.41 MW",
    status: "在线"
  }
];

const tasks = [
  ["TASK-20260817-031", "模型训练", "浙江杭州", "甘肃庆阳", "跨区调度", "126 GPU", "执行中", "14:26:08"],
  ["TASK-20260817-030", "推理服务", "北京亦庄", "河北廊坊", "弹性调度", "64 GPU", "执行中", "14:22:41"],
  ["TASK-20260817-029", "批量渲染", "浙江杭州", "浙江杭州", "延迟执行", "340 vCPU", "待执行", "14:18:23"],
  ["TASK-20260817-028", "科学计算", "北京海淀", "河北廊坊", "分布式执行", "92 GPU", "已完成", "14:09:57"],
  ["TASK-20260817-027", "数据处理", "甘肃兰州", "甘肃兰州", "延迟执行", "220 vCPU", "已完成", "13:56:14"]
];

const interfaces = [
  ["云霆任务接入接口", "电信云霆", "算力管控平台", "HTTPS", 38, "正常", "14:29:52"],
  ["星罗资源查询接口", "联通星罗", "算力管控平台", "HTTPS", 45, "正常", "14:29:49"],
  ["浙江负荷预测接口", "浙江国网", "电力系统", "MQ", 22, "正常", "14:29:55"],
  ["甘肃新能源预测接口", "甘肃国网", "电力系统", "MQ", 31, "正常", "14:29:51"],
  ["北京调控指令接口", "北京国网", "电力系统", "HTTPS", 68, "正常", "14:29:47"],
  ["审计日志服务", "平台内部", "基础服务", "gRPC", "--", "待联调", "14:28:02"]
];

const algorithmServices = [
  {
    id: "ALG-MATCH-01",
    name: "供需匹配服务",
    category: "候选资源筛选",
    endpoint: "/api/v1/matching/evaluate",
    version: "v1.3.2",
    deployment: "平台私有云",
    auth: "mTLS + 签名",
    timeout: "10 s",
    status: "正常",
    lastCall: "14:29:41",
    successRate: "99.8%",
    latency: "420 ms",
    description: "校验任务约束与资源边界，形成候选执行资源和匹配评分。"
  },
  {
    id: "ALG-CARBON-01",
    name: "低碳迁移服务",
    category: "调度方案生成",
    endpoint: "/api/v1/carbon-migration/optimize",
    version: "v1.2.0",
    deployment: "平台私有云",
    auth: "mTLS + Token",
    timeout: "30 s",
    status: "正常",
    lastCall: "14:29:45",
    successRate: "99.5%",
    latency: "1.8 s",
    description: "面向可迁移或可延迟任务，综合能源、算力、网络和成本生成执行方案。"
  },
  {
    id: "ALG-COLLAB-01",
    name: "协同计算服务",
    category: "协同编排方案",
    endpoint: "/api/v1/collaborative-compute/plan",
    version: "v1.1.4",
    deployment: "外部算法服务",
    auth: "mTLS + 签名",
    timeout: "30 s",
    status: "正常",
    lastCall: "14:22:32",
    successRate: "98.9%",
    latency: "2.3 s",
    description: "面向可拆分并行任务，在网络条件满足时生成多节点协同执行方案。"
  }
];

const navItems = [
  { id: "cockpit", label: "总览", icon: LayoutDashboard },
  { id: "triggers", label: "触发中心", icon: Zap },
  { id: "tasks", label: "调度任务", icon: ListChecks, children: [{ id: "taskInfo", label: "任务信息" }, { id: "taskMonitor", label: "调度监测" }] },
  { id: "resources", label: "资源管理", icon: Boxes, children: [{ id: "computeResources", label: "算力资源" }, { id: "powerResources", label: "电力资源" }, { id: "networkResources", label: "网络链路" }, { id: "managedResources", label: "纳管配置" }] },
  { id: "access", label: "接入管理", icon: Database, children: [{ id: "dataCatalog", label: "数据目录" }, { id: "fieldMapping", label: "字段映射" }, { id: "interfaceConfig", label: "接口配置" }, { id: "algorithmServices", label: "算法服务" }, { id: "accessMonitor", label: "接入监测" }] },
  { id: "system", label: "系统管理", icon: Settings, children: [{ id: "users", label: "用户权限" }, { id: "strategy", label: "策略配置" }, { id: "dictionary", label: "数据字典" }, { id: "audit", label: "审计日志" }] }
];

function Tag({ children, tone = "blue" }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

function ModuleTag({ name }) {
  return <Tag tone={["任务迁移", "跨区调度", "延迟执行"].includes(name) ? "green" : "blue"}>{name}</Tag>;
}

function PageHeading({ title, subtitle, actions }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="heading-actions">{actions}</div> : null}
    </div>
  );
}

function Button({ children, icon: Icon, variant = "default", onClick, disabled = false }) {
  return (
    <button className={`button button-${variant}`} type="button" onClick={onClick} disabled={disabled}>
      {Icon ? <Icon aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

function Panel({ title, extra, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {(title || extra) && (
        <div className="panel-head">
          <h2>{title}</h2>
          {extra}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

function Sidebar({ active, onSelect, collapsed, onCollapse, mobileOpen, closeMobile }) {
  const [expandedGroups, setExpandedGroups] = useState(() => new Set(navItems.filter(item=>item.children).map(item=>item.id)));
  const toggleGroup = id => setExpandedGroups(current => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}>
      <div className="brand">
        {!collapsed && <span>跨区域电算协同调度平台</span>}
      </div>
      <nav className="side-nav" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;
          const groupActive = active === item.id || item.children?.some(child => child.id === active);
          const expanded = item.children && expandedGroups.has(item.id);
          return (
            <div className={`side-nav-group ${expanded ? "expanded" : ""}`} key={item.id}>
              <button type="button" className={`primary-nav ${groupActive ? "active" : ""}`} aria-expanded={item.children ? expanded : undefined} onClick={() => { if (item.children && !collapsed) toggleGroup(item.id); else { onSelect(item.children?.[0]?.id || item.id); closeMobile(); } }} title={collapsed ? item.label : undefined}>
                <Icon aria-hidden="true" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.children && <ChevronDown className="nav-chevron" aria-hidden="true" />}
              </button>
              {!collapsed && expanded && <div className="sub-nav">{item.children.map(child=><button type="button" className={active===child.id?"active":""} onClick={()=>{onSelect(child.id);closeMobile();}} key={child.id}><span>{child.label}</span></button>)}</div>}
            </div>
          );
        })}
      </nav>
      <button className="collapse-button" type="button" onClick={onCollapse}>
        {collapsed ? <ChevronRight aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
        {!collapsed && <span>收起</span>}
      </button>
    </aside>
  );
}

function Header({ onMenu, activeLabel }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString("zh-CN", { hour12: false }));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <button className="icon-button menu-button" type="button" aria-label="打开导航" onClick={onMenu}><Menu /></button>
      <div className="breadcrumb"><span>首页</span><ChevronRight /><strong>{activeLabel}</strong></div>
      <div className="topbar-right">
        <span className="system-time">{time}</span>
        <button className="icon-button notification-button" type="button" aria-label="通知"><Bell /><b>12</b></button>
        <button className="icon-button" type="button" aria-label="帮助"><CircleHelp /></button>
        <div className="user-area"><span className="avatar">调</span><strong>调度管理员</strong><ChevronDown /></div>
      </div>
    </header>
  );
}

function Stat({ icon: Icon, label, value, unit, delta, tone = "blue", positiveWhenDown = false }) {
  return (
    <div className={`stat stat-${tone}`}>
      <div className="stat-icon"><Icon aria-hidden="true" /></div>
      <div><span>{label}</span><strong>{value}<small>{unit}</small></strong><em className={delta.startsWith("▼") && !positiveWhenDown ? "down" : "up"}>{delta}</em></div>
    </div>
  );
}

const mapBounds = { minLon: 103, maxLon: 123, minLat: 27, maxLat: 42 };

function projectPoint([lon, lat]) {
  return [
    ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * 720,
    ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 330
  ];
}

function curvedRoute(from, to, bend) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.max(Math.hypot(dx, dy), 1);
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const controlX = midX - dy / length * bend;
  const controlY = midY + dx / length * bend;
  return `M${from[0]},${from[1]} Q${controlX},${controlY} ${to[0]},${to[1]}`;
}

function geometryPath(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.map((polygon) => polygon.map((ring) => {
    const points = ring.map(projectPoint);
    return `${points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} Z`;
  }).join(" ")).join(" ");
}

function RegionalMap() {
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    let active = true;
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/china-provinces.json`)
      .then((response) => response.json())
      .then((data) => { if (active) setFeatures(data.features || []); })
      .catch(() => { if (active) setFeatures([]); });
    return () => { active = false; };
  }, []);

  const mapFeatures = useMemo(() => features.map((feature) => ({
    name: feature.properties?.name || "",
    path: geometryPath(feature.geometry)
  })), [features]);
  const targets = new Set(["甘肃省", "浙江省", "北京市", "河北省"]);
  const nodes = [
    { name: "甘肃", point: projectPoint([107.64, 35.73]), tone: "green", load: "0.74", adjustable: "0.18", boxX: 72, boxY: 57 },
    { name: "浙江", point: projectPoint([120.15, 30.27]), tone: "green", load: "0.92", adjustable: "0.24", boxX: 545, boxY: 176 },
    { name: "北京", point: projectPoint([116.40, 39.90]), tone: "blue", load: "0.68", adjustable: "0.14", boxX: 340, boxY: 64 },
    { name: "廊坊", point: projectPoint([116.68, 39.54]).map((value, index) => value + (index ? 20 : 18)), tone: "cyan", load: "0.56", adjustable: "0.16", boxX: 535, boxY: 105 }
  ];
  const [gansu, zhejiang, beijing, langfang] = nodes.map((node) => node.point);

  return (
    <div className="regional-map" aria-label="浙江、甘肃、北京和廊坊区域地图">
      <svg viewBox="0 0 720 330" role="img">
        <title>跨区域电算协同运行地图</title>
        <defs>
          <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 Z" fill="#42d398" /></marker>
          <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 Z" fill="#4da9ff" /></marker>
        </defs>
        <g className="map-viewport">
          <g className="map-provinces">
            {mapFeatures.map((feature) => <path key={feature.name} d={feature.path} className={targets.has(feature.name) ? "target" : ""} />)}
          </g>
          <path className="map-route route-green" d={curvedRoute(zhejiang, gansu, -38)} markerEnd="url(#arrow-green)" />
          <path className="map-route route-green route-return" d={curvedRoute(gansu, zhejiang, -30)} markerEnd="url(#arrow-green)" />
          <path className="map-route route-blue" d={curvedRoute(beijing, langfang, -48)} markerEnd="url(#arrow-blue)" />
          <path className="map-route route-blue route-return" d={curvedRoute(langfang, beijing, -40)} markerEnd="url(#arrow-blue)" />
          {nodes.map((node) => <g className={`map-node ${node.tone}`} key={node.name}>
            <circle className="map-node-halo halo-outer" cx={node.point[0]} cy={node.point[1]} r="15" />
            <circle className="map-node-halo halo-inner" cx={node.point[0]} cy={node.point[1]} r="9" />
            <circle className="map-node-core" cx={node.point[0]} cy={node.point[1]} r="4" />
          </g>)}
        </g>
        {nodes.map((node) => <g className="map-info-card" key={`info-${node.name}`}>
          <path d={`M${node.point[0]},${node.point[1]} L${Math.min(Math.max(node.point[0], node.boxX + 8), node.boxX + 124)},${node.boxY + 50}`} />
          <text className="map-info-name" x={node.boxX + 2} y={node.boxY - 7}>{node.name}</text>
          <rect x={node.boxX} y={node.boxY} width="132" height="50" rx="4" />
          <text className="map-info-key" x={node.boxX + 10} y={node.boxY + 20}>负荷</text>
          <text className="map-info-value" x={node.boxX + 55} y={node.boxY + 20}>{node.load} MW</text>
          <text className="map-info-key" x={node.boxX + 10} y={node.boxY + 40}>可调</text>
          <text className="map-info-value" x={node.boxX + 55} y={node.boxY + 40}>{node.adjustable} MW</text>
        </g>)}
      </svg>
      {!features.length && <span className="map-loading">行政区边界加载中</span>}
    </div>
  );
}

function LoadCurve() {
  const series = [
    { name: "浙江", tone: "green", points: "38,150 83,158 128,152 173,123 218,96 263,82 308,91 353,116" },
    { name: "甘肃", tone: "cyan", points: "38,126 83,119 128,108 173,101 218,106 263,122 308,130 353,121" },
    { name: "北京", tone: "blue", points: "38,162 83,166 128,155 173,132 218,112 263,104 308,114 353,136" },
    { name: "廊坊", tone: "orange", points: "38,142 83,145 128,139 173,128 218,121 263,116 308,124 353,131" }
  ];
  return <div className="load-chart">
    <svg viewBox="0 0 380 215" role="img" aria-label="区域负荷曲线">
      <title>浙江、甘肃、北京、廊坊区域负荷曲线</title>
      {[40, 80, 120, 160].map((y) => <line key={y} x1="38" y1={y} x2="353" y2={y} className="grid-line" />)}
      {series.map((item) => <polyline key={item.name} className={`load-line ${item.tone}`} points={item.points} />)}
      {[38, 143, 248, 353].map((x, i) => <text x={x} y="193" key={x} textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"}>{["00:00", "08:00", "16:00", "24:00"][i]}</text>)}
      <text x="8" y="45">高</text><text x="8" y="164">低</text>
    </svg>
    <div className="load-legend">{series.map((item) => <span key={item.name}><i className={`legend-${item.tone}`} />{item.name}</span>)}</div>
  </div>;
}

function CurrentExecutionChain() {
  const steps = [["任务接入", "完成"], ["资源匹配", "完成"], ["方案校核", "完成"], ["指令下发", "执行中"], ["结果确认", "待执行"]];
  return <div className="current-chain">
    <div className="chain-summary"><div><span>当前任务</span><strong>TASK-20260817-031</strong></div><div><span>推荐站点</span><strong>GS-QY-01</strong></div><div><span>执行路径</span><strong>浙江杭州 → 甘肃庆阳</strong></div><div><span>总体进度</span><strong>68%</strong></div></div>
    <div className="chain-steps">{steps.map((step, index) => <div className={step[1] === "执行中" ? "current" : step[1] === "完成" ? "done" : ""} key={step[0]}><i>{step[1] === "完成" ? <Check /> : index + 1}</i><strong>{step[0]}</strong><span>{step[1]}</span></div>)}</div>
    <div className="dispatch-result-strip"><span>推荐理由 <strong>低碳优先</strong></span><span>综合评分 <strong>0.91</strong></span><span>推荐有效期 <strong>15 min</strong></span></div>
    <div className="chain-progress"><i style={{ width: "68%" }} /></div>
  </div>;
}

function ExecutionStageResults() {
  const stages = [
    { name: "任务接入", status: "完成", time: "14:21:06", tone: "done", metrics: ["电网信号", "目标 0.42 MW", "时限 ≤15 min"] },
    { name: "资源匹配", status: "完成", time: "14:24:18", tone: "done", metrics: ["GS-QY-01", "评分 0.91", "可用 1.8 PFLOPS"] },
    { name: "方案校核", status: "完成", time: "14:26:32", tone: "done", metrics: ["边界通过", "时延 38 ms", "预计减排 0.18 t"] },
    { name: "指令下发", status: "执行中", time: "14:29:49", tone: "current", metrics: ["平台已受理", "资源已锁定", "进度 68%"] },
    { name: "结果确认", status: "待执行", time: "--", tone: "pending", metrics: ["响应时间待核算", "调节偏差待核算", "实际减排待核算"] }
  ];
  return <div className="stage-result-list">{stages.map((stage, index) => <div className={`stage-result ${stage.tone}`} key={stage.name}>
    <i>{stage.tone === "done" ? <Check/> : index + 1}</i>
    <div className="stage-result-copy"><div><strong>{stage.name}</strong><em>{stage.status}</em><time>{stage.time}</time></div><p>{stage.metrics.map(metric => <span key={metric}>{metric}</span>)}</p></div>
  </div>)}</div>;
}

function CompletionMetrics() {
  const metrics = [
    [FileClock, "响应时间", "待核算", "完成后更新", "pending"],
    [Gauge, "调节偏差", "待核算", "完成后更新", "pending"],
    [Leaf, "执行地绿电占比", "待核算", "按实际执行站点", "pending"],
    [Network, "实际传输时长", "待核算", "完成后更新", "pending"],
    [Zap, "预计执行成本", "286 元", "算力 / 网络 / 电力成本", "forecast"],
    [Activity, "预计执行碳排", "0.42 t", "较原执行地 ↓0.18 t", "forecast"]
  ];
  return <div className="completion-metrics">{metrics.map(([Icon,label,value,note,state])=><div className={state} key={label}><Icon aria-hidden="true"/><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>;
}

function MigrationSankey() {
  const regions = [
    { name: "浙江", tone: "green", y: 38 },
    { name: "甘肃", tone: "cyan", y: 82 },
    { name: "北京", tone: "blue", y: 126 },
    { name: "廊坊", tone: "orange", y: 170 }
  ];
  const flows = [
    [0, 0, 0.08], [0, 1, 0.22],
    [1, 0, 0.16], [1, 1, 0.05],
    [2, 2, 0.06], [2, 3, 0.12],
    [3, 2, 0.09], [3, 3, 0.04]
  ];
  return <div className="migration-sankey">
    <svg viewBox="0 0 400 220" role="img" aria-label="四区域任务调度流向图">
      <title>浙江、甘肃、北京和廊坊之间的任务调度流向</title>
      <line className="sankey-divider" x1="56" y1="104" x2="344" y2="104" />
      <g className="sankey-links">
        {flows.map(([source, target, value]) => {
          const from = regions[source];
          const to = regions[target];
          return <path key={`${source}-${target}`} className={`sankey-link ${from.tone}`} d={`M82,${from.y} C160,${from.y} 240,${to.y} 318,${to.y}`} style={{ strokeWidth: 1.5 + value * 20 }} />;
        })}
      </g>
      {regions.map((region) => <g className={`sankey-region ${region.tone}`} key={`from-${region.name}`}>
        <text x="56" y={region.y + 4} textAnchor="end">{region.name}</text>
        <rect x="68" y={region.y - 12} width="14" height="24" rx="1" />
      </g>)}
      {regions.map((region) => <g className={`sankey-region ${region.tone}`} key={`to-${region.name}`}>
        <rect x="318" y={region.y - 12} width="14" height="24" rx="1" />
        <text x="344" y={region.y + 4}>{region.name}</text>
      </g>)}
    </svg>
    <div className="sankey-note"><strong>迁出 0.82 MW</strong><strong>迁入 0.82 MW</strong></div>
  </div>;
}

function DispatchTrigger() {
  return <div className="trigger-monitor">
    <div className="current-trigger">
      <div className="trigger-kicker"><Zap/><span>当前触发来源</span><Tag tone="green">电网调节</Tag></div>
      <strong>浙江电网负荷调节信号</strong>
      <small>DR-20260817-014 · 14:21:06 接收</small>
      <div className="trigger-facts"><span>目标调节<strong>0.42 MW</strong></span><span>确认期限<strong>14:22:06</strong></span></div>
    </div>
    <div className="active-evaluation">
      <div className="evaluation-head"><Activity/><strong>主动调度持续评估</strong><Tag tone="blue">条件满足</Tag></div>
      <p><span>甘肃新能源富余</span><strong>0.31 MW</strong></p>
      <p><span>庆阳可用算力</span><strong>1.8 PFLOPS</strong></p>
      <p><span>跨区网络时延</span><strong>38 ms</strong></p>
    </div>
    <div className="trigger-decision"><span>建议操作</span><strong>确认接收指令，创建 0.42 MW 调度任务</strong></div>
  </div>;
}

function Cockpit({ onNavigate }) {
  return (
    <div className="cockpit">
      <div className="cockpit-titlebar">
        <div><h1>跨区域电算协同调度驾驶舱</h1></div>
        <div className="cockpit-controls"><span className="live-dot">实时运行</span></div>
      </div>
      <div className="stats-grid">
        <Stat icon={Workflow} label="今日调度任务" value="286" unit="项" delta="▲ 12.6%" />
        <Stat icon={Activity} label="负荷响应量" value="0.68" unit="MW" delta="▲ 8.3%" tone="blue" />
        <Stat icon={FileClock} label="平均响应时间" value="8.6" unit="min" delta="▼ 0.8min" positiveWhenDown tone="orange" />
        <Stat icon={Leaf} label="碳减排率" value="18.7" unit="%" delta="▲ 2.1%" tone="green" />
      </div>
      <div className="cockpit-main-grid compact">
        <Panel title="电算协同区域态势" className="dark-panel topology-panel" extra={<span className="panel-status"><i />链路正常</span>}><RegionalMap /></Panel>
        <Panel title="调度触发与决策" className="dark-panel trigger-panel" extra={<button onClick={() => onNavigate("triggers")}>详情 <ChevronRight /></button>}><DispatchTrigger /></Panel>
      </div>
      <div className="cockpit-bottom-grid single">
        <Panel title="本次执行指标监测" className="dark-panel execution-monitor-panel wide" extra={<button onClick={() => onNavigate("taskMonitor")}>详情 <ChevronRight /></button>}><div className="execution-monitor-layout"><div className="monitor-chain"><CurrentExecutionChain /></div><div className="monitor-metrics"><CompletionMetrics /></div></div></Panel>
      </div>
    </div>
  );
}

function Filters({ fields = ["任务编号", "任务类型", "运行状态"] }) {
  return (
    <div className="filters">
      {fields.map((field, i) => (
        <label key={field}><span>{field}</span>{i === 0 ? <input placeholder="请输入" /> : <select defaultValue=""><option value="">请选择</option><option>全部</option></select>}</label>
      ))}
      <div className="filter-actions"><Button icon={Search} variant="primary">查询</Button><Button icon={RefreshCw}>重置</Button><button className="text-button" type="button">展开 <ChevronDown /></button></div>
    </div>
  );
}

function DataToolbar({ primaryLabel, onPrimary, withStop = false }) {
  return (
    <div className="data-toolbar">
      <Button icon={Plus} variant="outline" onClick={onPrimary}>{primaryLabel}</Button>
      <Button icon={Play} variant="success">批量启用</Button>
      {withStop && <Button icon={StopCircle} variant="danger">批量停用</Button>}
      <Button icon={Download}>导出</Button>
      <button className="icon-button bordered" type="button" aria-label="表格设置"><Settings /></button>
    </div>
  );
}

function Pagination({ count }) {
  return <div className="pagination"><span>共 {count} 条</span><div><select><option>10条/页</option></select><button><ChevronLeft /></button><b>1</b><button><ChevronRight /></button><span>前往</span><input value="1" readOnly /><span>页</span></div></div>;
}

function TriggerCenterPage({ notify }) {
  const [pendingInstructions,setPendingInstructions] = useState([
    { id:"GRID-ZJ-20260817-022", source:"浙江国网", title:"区域负荷调节指令", received:"14:31:24", region:"浙江", target:"降低 0.36 MW", deadline:"10 min", window:"14:40–15:10", priority:"重要", note:"要求平台确认可响应资源，并在规定时间内反馈接收结果" },
    { id:"GRID-BJ-20260817-009", source:"北京国网", title:"算力负荷削峰指令", received:"14:29:08", region:"北京", target:"降低 0.18 MW", deadline:"15 min", window:"14:45–15:30", priority:"一般", note:"需要确认北京区域可转移任务及候选执行资源" },
    { id:"GRID-GS-20260817-006", source:"甘肃国网", title:"新能源消纳协同请求", received:"14:26:42", region:"甘肃", target:"增加 0.24 MW", deadline:"20 min", window:"15:00–16:00", priority:"一般", note:"需要确认可承接算力任务规模并反馈执行窗口" }
  ]);
  const [selectedInstruction,setSelectedInstruction] = useState("GRID-ZJ-20260817-022");
  const currentInstruction = pendingInstructions.find(item=>item.id===selectedInstruction) || pendingInstructions[0];
  const confirmInstruction = () => {
    if (!currentInstruction) return;
    notify(`已确认接收电网指令：${currentInstruction.id}`);
    setPendingInstructions(current=>current.filter(item=>item.id!==currentInstruction.id));
    setSelectedInstruction("");
  };
  const events = [
    ["TRG-20260817-014", "电网指令", "浙江国网", "浙江", "0.42 MW / 15 min", "14:21:06", "已生成任务", "TASK-20260817-031"],
    ["TRG-20260817-013", "主动调度", "平台资源评估", "北京 / 廊坊", "算力负载优化", "14:18:52", "已生成任务", "TASK-20260817-030"],
    ["TRG-20260817-012", "平台请求", "电信云霆", "浙江", "模型训练 126 GPU", "14:16:33", "评估中", "--"],
    ["TRG-20260817-011", "主动调度", "新能源富余监测", "甘肃", "富余 0.31 MW", "14:12:19", "未触发", "--"],
    ["TRG-20260817-010", "人工触发", "调度管理员", "北京 / 廊坊", "验证批次 JJJ-01", "14:08:45", "已生成任务", "TASK-20260817-028"]
  ];
  return <div className="work-page">
    <PageHeading title="触发中心" subtitle="统一接收电网指令、主动资源事件、平台请求和人工触发" actions={<Button icon={RefreshCw} variant="primary" onClick={()=>notify("触发事件已刷新")}>刷新事件</Button>}/>
    <Panel title="待确认电网指令" className="pending-instruction-panel" extra={<Tag tone={pendingInstructions.length?"orange":"green"}>{pendingInstructions.length} 条待处理</Tag>}>
      {currentInstruction ? <div className="pending-instruction-layout"><section className="instruction-focus"><header><div><Zap/><span>外部电网指令</span></div><Tag tone="orange">{currentInstruction.priority}</Tag></header><h3>{currentInstruction.title}</h3><p>{currentInstruction.source} · {currentInstruction.id} · {currentInstruction.received} 接收</p><div className="instruction-route"><div><span>指令来源</span><strong>{currentInstruction.source}</strong></div><ChevronRight/><div><span>响应区域</span><strong>{currentInstruction.region}</strong></div></div><div className="instruction-facts"><div><span>目标调节</span><strong>{currentInstruction.target}</strong></div><div><span>确认期限</span><strong>{currentInstruction.deadline}</strong></div><div><span>执行窗口</span><strong>{currentInstruction.window}</strong></div><div><span>当前状态</span><strong>等待人工确认</strong></div></div><div className="instruction-note"><CircleHelp/><span>{currentInstruction.note}</span></div><footer><Button onClick={()=>notify(`查看指令详情：${currentInstruction.id}`)}>查看详情</Button><Button icon={Check} variant="primary" onClick={confirmInstruction}>确认接收</Button></footer></section><aside className="instruction-queue"><div className="instruction-queue-head"><strong>未处理指令</strong><span>按接收时间排序</span></div>{pendingInstructions.map(item=><button type="button" className={item.id===currentInstruction.id?"active":""} onClick={()=>setSelectedInstruction(item.id)} key={item.id}><div><strong>{item.source}</strong><Tag tone={item.priority==="重要"?"orange":"blue"}>{item.priority}</Tag></div><span>{item.title}</span><small>{item.received} · {item.target} · {item.deadline} 内确认</small></button>)}</aside></div> : <div className="instruction-empty"><Check/><strong>当前没有待确认电网指令</strong><span>新指令接入后将在此处优先显示</span></div>}
    </Panel>
    <div className="summary-strip trigger-summary"><div><Zap/><span>今日触发事件</span><strong>42</strong></div><div><AlertTriangle/><span>待确认指令</span><strong>{pendingInstructions.length}</strong></div><div><Gauge/><span>待评估事件</span><strong>3</strong></div><div><ListChecks/><span>已生成任务</span><strong>31</strong></div></div>
    <Panel><Filters fields={["事件编号", "触发类型", "处理状态"]}/><div className="table-wrap"><table><thead><tr><th>事件编号</th><th>触发类型</th><th>触发来源</th><th>涉及区域</th><th>触发目标</th><th>接收时间</th><th>评估结果</th><th>关联任务</th><th>操作</th></tr></thead><tbody>{events.map((event)=><tr key={event[0]}><td><strong>{event[0]}</strong></td><td><Tag tone={event[1]==="电网指令"?"orange":event[1]==="主动调度"?"green":"blue"}>{event[1]}</Tag></td><td>{event[2]}</td><td>{event[3]}</td><td>{event[4]}</td><td>{event[5]}</td><td><Tag tone={event[6]==="已生成任务"?"green":event[6]==="评估中"?"orange":"gray"}>{event[6]}</Tag></td><td>{event[7]}</td><td className="row-actions"><button onClick={()=>notify(`查看触发事件：${event[0]}`)}>详情</button><button>评估过程</button></td></tr>)}</tbody></table></div><Pagination count={42}/></Panel>
  </div>;
}

function TaskExecutionResults() {
  const steps = [["任务接入","完成"],["资源匹配","完成"],["方案校核","完成"],["指令下发","执行中"],["结果确认","待执行"]];
  const stages = [
    { name:"任务接入", status:"已完成", timeLabel:"任务生成", time:"14:21:09", tone:"done", highlights:["触发：浙江国网调节信号","要求：15 分钟内形成响应"], metrics:[["信号接收时间","14:21:06"],["任务类型","模型训练"],["任务规模","126 GPU"],["目标负荷响应","0.42 MW"],["要求响应时间","≤ 15 min"],["数据完整性","100%"]] },
    { name:"资源匹配", status:"已完成", timeLabel:"匹配完成", time:"14:24:18", tone:"done", highlights:["调出资源：杭州数据中心","推荐执行资源：庆阳算力集群"], metrics:[["匹配开始时间","14:21:12"],["匹配完成时间","14:24:18"],["实际匹配耗时","3 min 06 s"],["候选资源","3 个"],["推荐综合评分","0.91"],["可用算力","1.8 PFLOPS"]] },
    { name:"方案校核", status:"已完成", timeLabel:"校核完成", time:"14:26:32", tone:"done", highlights:["浙江杭州 → 甘肃庆阳","跨区域迁移 126 GPU，对应负荷响应 0.42 MW"], metrics:[["调出算力中心","杭州数据中心"],["执行算力中心","庆阳算力集群"],["调度方式","任务整体迁移"],["计划执行时段","14:30–15:08"],["预计传输时长","4 min 36 s"],["预计执行时长","38 min"],["网络时延","38 ms"],["边界校核","全部通过"]] },
    { name:"指令下发", status:"执行中", timeLabel:"最近反馈", time:"14:56:12", tone:"current", highlights:["控制通道：电信云霆","庆阳算力集群已锁定并执行"], metrics:[["指令下发时间","14:29:49"],["平台受理时间","14:29:52"],["实际启动时间","14:30:05"],["已执行时长","26 min 07 s"],["计划结束时间","15:08:00"],["当前进度","68%"]] },
    { name:"结果确认", status:"待执行", timeLabel:"计划结束", time:"15:08:00", tone:"pending", highlights:["等待执行结束回执","实际执行时间以控制平台反馈为准"], metrics:[["实际结束时间","待反馈"],["结束回执时间","待反馈"],["实际执行时长","待核算"],["实际传输时长","待核算"],["调节偏差","待核算"],["实际减排量","待核算"]] }
  ];
  return <>
    <Panel title="当前执行链路"><div className="process-flow">{steps.map((step,index)=><div className={step[1]==="执行中"?"current":step[1]==="完成"?"done":""} key={step[0]}><i>{step[1]==="完成"?<Check/>:index+1}</i><strong>{step[0]}</strong><span>{step[1]}</span></div>)}</div><div className="execution-detail"><div><span>当前任务</span><strong>TASK-20260817-031</strong></div><div><span>执行路径</span><strong>浙江杭州 → 甘肃庆阳</strong></div><div><span>调度方式 / 规模</span><strong>任务整体迁移 · 0.42 MW</strong></div><div><span>总体进度</span><strong>68%</strong></div><div><span>计划执行时段</span><strong>14:30:00–15:08:00</strong></div><div><span>实际启动时间</span><strong>14:30:05</strong></div><div><span>已执行时长</span><strong>26 min 07 s</strong></div><div><span>预计剩余时间</span><strong>11 min 53 s</strong></div></div><div className="progress-large"><i style={{width:"68%"}}/></div></Panel>
    <div className="stage-detail-stack">{stages.map((stage,index)=><section className={`stage-detail ${stage.tone}`} key={stage.name}><div className="stage-detail-marker"><i>{stage.tone==="done"?<Check/>:index+1}</i><span/></div><div className="stage-detail-content"><header><strong>{stage.name}</strong><div><Tag tone={stage.tone==="done"?"green":stage.tone==="current"?"blue":"gray"}>{stage.status}</Tag><time><b>{stage.timeLabel}</b>{stage.time}</time></div></header><div className="stage-keyline">{stage.highlights.map(item=><strong key={item}>{item}</strong>)}</div><div className="stage-metric-grid">{stage.metrics.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>{stage.tone==="current"&&<div className="stage-live-line"><span>执行进度</span><div><i style={{width:"68%"}}/></div><strong>68%</strong></div>}</div></section>)}</div>
  </>;
}

function TaskDetail({ task, onBack }) {
  const [tab,setTab]=useState("execution");
  return <div className="work-page"><div className="task-detail-heading"><button className="back-button" onClick={onBack}><ChevronLeft/>返回任务列表</button><div><h1>{task[0]}</h1><p>{task[1]} · {task[2]} → {task[3]}</p></div><Tag tone="green">{task[6]}</Tag></div><div className="page-tabs"><button className={tab==="info"?"active":""} onClick={()=>setTab("info")}>任务信息</button><button className={tab==="decision"?"active":""} onClick={()=>setTab("decision")}>调度决策</button><button className={tab==="execution"?"active":""} onClick={()=>setTab("execution")}>执行与结果</button><button className={tab==="records"?"active":""} onClick={()=>setTab("records")}>操作记录</button></div>
    {tab==="info"&&<Panel title="任务信息"><div className="detail-grid">{[["任务类型",task[1]],["触发事件","TRG-20260817-014"],["触发来源","浙江国网调节指令"],["资源需求",task[5]],["调出地",task[2]],["候选执行区域","甘肃 / 浙江"],["目标调节量","0.42 MW"],["响应时限","≤ 15 min"],["验证批次","浙江-甘肃验证-01"],["接入时间",task[7]]].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div></Panel>}
    {tab==="decision"&&<><Panel title="选定方案"><div className="decision-summary"><div><span>推荐站点</span><strong>甘肃庆阳算力集群</strong><small>GS-QY-01</small></div><div><span>调度方式</span><strong>跨区调度</strong><small>低碳优先</small></div><div><span>综合评分</span><strong>0.91</strong><small>推荐有效期 15 min</small></div><div><span>预计成效</span><strong>减排 0.18 t</strong><small>预计成本 286 元</small></div></div></Panel><Panel title="候选方案对比"><div className="table-wrap"><table><thead><tr><th>候选站点</th><th>区域</th><th>综合评分</th><th>预计完成</th><th>传输时长</th><th>预计成本</th><th>预计碳排</th><th>结果</th></tr></thead><tbody>{[["GS-QY-01","甘肃庆阳","0.91","38 min","4.6 min","286 元","0.42 t","已选定"],["ZJ-HZ-03","浙江杭州","0.86","44 min","0.8 min","318 元","0.60 t","备选"],["GS-LZ-02","甘肃兰州","0.82","52 min","5.2 min","274 元","0.47 t","备选"]].map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i}>{i===7?<Tag tone={v==="已选定"?"green":"gray"}>{v}</Tag>:v}</td>)}</tr>)}</tbody></table></div></Panel></>}
    {tab==="execution"&&<TaskExecutionResults/>}
    {tab==="records"&&<Panel title="操作记录"><div className="timeline"><div><i className="green"/><strong>控制平台确认资源锁定</strong><span>系统自动 · 14:29:52</span><Tag tone="green">成功</Tag></div><div><i className="blue"/><strong>调度方案完成边界校核</strong><span>系统自动 · 14:26:32</span><Tag tone="green">通过</Tag></div><div><i className="orange"/><strong>调度管理员确认推荐方案</strong><span>调度管理员 · 14:25:48</span><Tag tone="blue">已确认</Tag></div></div></Panel>}
  </div>;
}

function TasksPage({ notify, openTaskModal }) {
  const [selectedTask,setSelectedTask]=useState(null);
  if(selectedTask) return <TaskDetail task={selectedTask} onBack={()=>setSelectedTask(null)}/>;
  return <div className="work-page"><PageHeading title="调度任务" subtitle="统一管理任务需求、调度决策、执行过程和最终成效" actions={<Button icon={Plus} variant="primary" onClick={openTaskModal}>新建任务</Button>}/><div className="summary-strip"><div><ListChecks/><span>全部任务</span><strong>286</strong></div><div><Gauge/><span>待评估</span><strong>8</strong></div><div><Activity/><span>执行中</span><strong>12</strong></div><div><Check/><span>今日完成</span><strong>68</strong></div></div><div className="page-tabs"><button className="active">全部任务</button><button>待评估</button><button>待确认</button><button>执行中</button><button>已完成</button><button>异常终止</button></div><Panel><Filters fields={["任务编号","触发方式","运行状态"]}/><DataToolbar primaryLabel="新建任务" onPrimary={openTaskModal}/><div className="table-wrap"><table><thead><tr><th><input type="checkbox"/></th><th>任务编号</th><th>任务类型</th><th>触发方式</th><th>调出地</th><th>执行地</th><th>选定策略</th><th>资源需求</th><th>运行状态</th><th>接入时间</th><th>操作</th></tr></thead><tbody>{tasks.map((t,index)=><tr key={t[0]}><td><input type="checkbox"/></td><td><button className="table-link" onClick={()=>setSelectedTask(t)}>{t[0]}</button></td><td>{t[1]}</td><td><Tag tone={index===0?"orange":index===1?"blue":"gray"}>{["电网指令","主动调度","平台请求","人工触发","主动调度"][index]}</Tag></td><td>{t[2]}</td><td>{t[3]}</td><td><ModuleTag name={t[4]}/></td><td>{t[5]}</td><td><Tag tone={t[6]==="执行中"?"green":t[6]==="待执行"?"orange":"blue"}>{t[6]}</Tag></td><td>{t[7]}</td><td className="row-actions"><button onClick={()=>setSelectedTask(t)}>详情</button><button onClick={()=>setSelectedTask(t)}>追踪</button><button>更多</button></td></tr>)}</tbody></table></div><Pagination count={286}/></Panel></div>;
}

function TaskInfoPage({ openTaskModal }) {
  const [selectedTask,setSelectedTask]=useState(null);
  if(selectedTask) return <div className="work-page"><div className="task-detail-heading"><button className="back-button" onClick={()=>setSelectedTask(null)}><ChevronLeft/>返回任务信息</button><div><h1>{selectedTask[0]}</h1><p>{selectedTask[1]} · {selectedTask[2]} → {selectedTask[3]}</p></div><Tag tone={selectedTask[6]==="执行中"?"green":"blue"}>{selectedTask[6]}</Tag></div><Panel title="任务详情"><div className="detail-grid">{[["任务类型",selectedTask[1]],["触发事件","TRG-20260817-014"],["触发来源","浙江国网调节指令"],["资源需求",selectedTask[5]],["调出地",selectedTask[2]],["执行地",selectedTask[3]],["选定策略",selectedTask[4]],["目标调节量","0.42 MW"],["响应时限","≤ 15 min"],["接入时间",selectedTask[7]]].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div></Panel><Panel title="调度决策摘要"><div className="decision-summary"><div><span>选定站点</span><strong>甘肃庆阳算力集群</strong><small>GS-QY-01</small></div><div><span>综合评分</span><strong>0.91</strong><small>低碳优先</small></div><div><span>预计完成时间</span><strong>38 min</strong><small>传输约 4.6 min</small></div><div><span>预计成效</span><strong>减排 0.18 t</strong><small>预计成本 286 元</small></div></div></Panel><Panel title="最近操作记录"><div className="timeline"><div><i className="green"/><strong>控制平台确认资源锁定</strong><span>系统自动 · 14:29:52</span><Tag tone="green">成功</Tag></div><div><i className="blue"/><strong>调度方案完成边界校核</strong><span>系统自动 · 14:26:32</span><Tag tone="green">通过</Tag></div><div><i className="orange"/><strong>调度管理员确认推荐方案</strong><span>调度管理员 · 14:25:48</span><Tag tone="blue">已确认</Tag></div></div></Panel></div>;
  return <div className="work-page"><PageHeading title="任务信息" subtitle="查询当前任务与历史任务，查看任务需求和调度决策详情" actions={<Button icon={Plus} variant="primary" onClick={openTaskModal}>新建任务</Button>}/><div className="summary-strip"><div><ListChecks/><span>当前任务</span><strong>28</strong></div><div><Gauge/><span>待评估</span><strong>8</strong></div><div><Activity/><span>执行中</span><strong>12</strong></div><div><FileClock/><span>历史任务</span><strong>258</strong></div></div><Panel><Filters fields={["任务编号","任务范围","运行状态"]}/><DataToolbar primaryLabel="新建任务" onPrimary={openTaskModal}/><div className="table-wrap"><table><thead><tr><th>任务编号</th><th>任务类型</th><th>触发方式</th><th>调出地</th><th>执行地</th><th>选定策略</th><th>资源需求</th><th>运行状态</th><th>接入时间</th><th>操作</th></tr></thead><tbody>{tasks.map((t,index)=><tr key={t[0]}><td><button className="table-link" onClick={()=>setSelectedTask(t)}>{t[0]}</button></td><td>{t[1]}</td><td><Tag tone={index===0?"orange":index===1?"blue":"gray"}>{["电网指令","主动调度","平台请求","人工触发","主动调度"][index]}</Tag></td><td>{t[2]}</td><td>{t[3]}</td><td><ModuleTag name={t[4]}/></td><td>{t[5]}</td><td><Tag tone={t[6]==="执行中"?"green":t[6]==="待执行"?"orange":"blue"}>{t[6]}</Tag></td><td>{t[7]}</td><td className="row-actions"><button onClick={()=>setSelectedTask(t)}>详情</button><button>更多</button></td></tr>)}</tbody></table></div><Pagination count={286}/></Panel></div>;
}

function TaskMonitorPage({ notify }) {
  return <div className="work-page"><PageHeading title="调度监测" subtitle="监测当前执行任务链路，并随执行阶段加载结果和成效指标" actions={<Button icon={RefreshCw} variant="primary" onClick={()=>notify("执行状态已刷新")}>刷新状态</Button>}/><div className="monitor-task-bar"><div><span>当前监测任务</span><select defaultValue="TASK-20260817-031"><option>TASK-20260817-031 · 浙江杭州 → 甘肃庆阳</option><option>TASK-20260817-030 · 北京亦庄 → 河北廊坊</option></select></div><Tag tone="green">执行中</Tag><div><span>开始时间</span><strong>14:26:08</strong></div><div><span>执行进度</span><strong>68%</strong></div></div><TaskExecutionResults/><Panel title="本任务算法调用记录" extra={<Tag tone="green">调用正常</Tag>}><div className="table-wrap"><table><thead><tr><th>调用阶段</th><th>算法服务</th><th>调用编号</th><th>开始时间</th><th>计算耗时</th><th>输出摘要</th><th>状态</th><th>操作</th></tr></thead><tbody><tr><td>候选资源筛选</td><td><strong>供需匹配服务</strong></td><td>CALL-MATCH-260817-031</td><td>14:24:18</td><td>420 ms</td><td>形成 3 个候选资源</td><td><Tag tone="green">成功</Tag></td><td className="row-actions"><button>输入摘要</button><button>输出摘要</button></td></tr><tr><td>调度方案生成</td><td><strong>低碳迁移服务</strong></td><td>CALL-CARBON-260817-031</td><td>14:24:21</td><td>1.8 s</td><td>选定杭州至庆阳方案</td><td><Tag tone="green">成功</Tag></td><td className="row-actions"><button>输入摘要</button><button>输出摘要</button></td></tr></tbody></table></div><div className="algorithm-call-note"><ShieldCheck/><span>当前任务根据任务属性与约束进入低碳迁移服务，协同计算服务未参与本次方案生成。</span></div></Panel></div>;
}

function ResourcesPage() {
  const nodes = [
    ["甘肃庆阳算力集群", "甘肃 · 庆阳", "4.8 PFlops", "43%", "0.82 MW", "正常", "电信云霆"],
    ["浙江杭州算力节点", "浙江 · 杭州", "3.2 PFlops", "78%", "0.34 MW", "正常", "电信云霆"],
    ["北京亦庄算力节点", "北京 · 亦庄", "5.1 PFlops", "77%", "0.28 MW", "偏高", "联通星罗"],
    ["河北廊坊算力节点", "河北 · 廊坊", "4.5 PFlops", "54%", "0.41 MW", "正常", "联通星罗"]
  ];
  return <div className="work-page"><PageHeading title="资源管理" subtitle="汇聚已纳管算力中心、电力可调资源与网络链路状态" actions={<Button icon={RefreshCw} variant="primary">同步资源</Button>} /><div className="summary-strip"><div><Cpu /><span>算力节点</span><strong>24</strong></div><div><Zap /><span>可调负荷</span><strong>1.85 MW</strong></div><div><Network /><span>跨区链路</span><strong>8</strong></div><div><ShieldCheck /><span>健康资源</span><strong>96.4%</strong></div></div><Panel title="纳管算力中心" extra={<div className="segmented"><button className="active">算力节点</button><button>电力资源</button><button>网络链路</button></div>}><div className="resource-grid">{nodes.map((n) => <article className="resource-node" key={n[0]}><div className="resource-icon"><HardDrive /></div><div className="resource-title"><div><h3>{n[0]}</h3><span>{n[1]}</span></div><Tag tone={n[5] === "正常" ? "green" : "orange"}>{n[5]}</Tag></div><dl><div><dt>可用算力</dt><dd>{n[2]}</dd></div><div><dt>当前负载</dt><dd>{n[3]}</dd></div><div><dt>可调电力</dt><dd>{n[4]}</dd></div><div><dt>控制通道</dt><dd>{n[6]}</dd></div></dl><div className="node-meter"><i style={{width:n[3]}} /></div><button>查看资源详情 <ChevronRight /></button></article>)}</div></Panel></div>;
}

function ManagedPage({ openModal, notify }) {
  return (
    <div className="work-page">
      <PageHeading title="纳管配置" subtitle="以算力中心和节点为纳管对象，维护其电网数据来源与末端控制通道" />
      <div className="summary-strip"><div><Grid2X2/><span>纳管区域</span><strong>4</strong></div><div><HardDrive/><span>数据中心</span><strong>7</strong></div><div><Zap/><span>地方电网</span><strong>4</strong></div><div><Network/><span>可用链路</span><strong>8</strong></div></div>
      <Panel><Filters fields={["算力中心名称", "所属区域", "地方电网", "运行状态"]} /><DataToolbar primaryLabel="新增算力中心" onPrimary={openModal} withStop />
        <div className="table-wrap"><table><thead><tr><th><input type="checkbox" /></th><th>算力中心 / 节点</th><th>所属区域</th><th>地方电网</th><th>电网数据状态</th><th>算力控制通道</th><th>控制接口状态</th><th>可用算力</th><th>可调负荷</th><th>运行状态</th><th>操作</th></tr></thead><tbody>{managedCenters.map((center) => <tr key={center.id}><td><input type="checkbox" /></td><td><strong>{center.name}</strong><small className="cell-sub">{center.id}</small></td><td>{center.region}</td><td>{center.grid}</td><td><Tag tone={center.gridStatus === "正常" ? "green" : "orange"}>{center.gridStatus}</Tag></td><td>{center.controlPlatform}<small className="cell-sub">指令下发 / 状态回传</small></td><td><Tag tone={center.controlStatus === "正常" ? "green" : "orange"}>{center.controlStatus}</Tag></td><td>{center.compute}</td><td>{center.adjustable}</td><td><Tag tone="green">{center.status}</Tag></td><td className="row-actions"><button onClick={() => notify(`正在编辑：${center.name}纳管配置`)}>编辑</button><button>资源</button><button>停用</button><button>更多</button></td></tr>)}</tbody></table></div><Pagination count={7} /></Panel>
      <div className="three-panels">
        <Panel title="区域调度关系" extra={<button className="panel-link">更多 <ChevronRight /></button>}><div className="compact-table"><div className="compact-head"><span>调出区域</span><span>执行区域</span><span>可用方式</span><span>时延</span><span>状态</span></div>{[["浙江","甘肃","任务迁移","38 ms","可用"],["甘肃","浙江","任务迁移","38 ms","可用"],["北京","廊坊","迁移 / 协同","8 ms","可用"],["北京","北京","延迟 / 分布式","本地","可用"]].map(r=><div className="compact-row" key={r.join("")} >{r.map((v,i)=><span key={i}>{i===2?<ModuleTag name={v}/>:i===4?<Tag tone="green">{v}</Tag>:v}</span>)}</div>)}</div><Pagination count={8}/></Panel>
        <Panel title="接口健康状态" extra={<button className="panel-link">更多 <ChevronRight /></button>}><div className="health-list">{interfaces.slice(0,4).map(i=><div key={i[0]}><span className={`health-dot ${i[5]!=="正常"?"warning":""}`}/><div><strong>{i[0]}</strong><small>{i[1]} · {i[3]}</small></div><Tag tone={i[5]==="正常"?"green":"orange"}>{i[5]}</Tag><em>{i[4]} ms</em></div>)}</div></Panel>
        <Panel title="最近配置变更" extra={<button className="panel-link">更多 <ChevronRight /></button>}><div className="timeline"><div><i className="green"/><strong>更新廊坊数据中心资源边界</strong><span>调度管理员 · 14:12:36</span><Tag tone="green">已发布</Tag></div><div><i className="blue"/><strong>更新北京国网调节信号映射</strong><span>接口管理员 · 11:08:52</span><Tag tone="green">已发布</Tag></div><div><i className="orange"/><strong>新增庆阳算力节点纳管申请</strong><span>资源管理员 · 昨日 16:45:11</span><Tag tone="orange">待审核</Tag></div></div></Panel>
      </div>
    </div>
  );
}

function PlansPage({ notify }) {
  const plans = [["PLAN-0817-018","浙江 → 甘肃","跨区调度","杭州 → 庆阳","0.42 MW","126 GPU","待审批"],["PLAN-0817-017","北京 → 廊坊","分布式执行","亦庄 → 廊坊","0.18 MW","64 GPU","执行中"],["PLAN-0817-016","浙江 → 浙江","延迟执行","宁波 → 宁波","0.27 MW","220 vCPU","已完成"],["PLAN-0817-015","北京 → 廊坊","弹性调度","海淀 → 廊坊","0.14 MW","48 GPU","已完成"]];
  return <div className="work-page"><PageHeading title="调度方案" subtitle="基于任务需求和纳管资源生成、审核并下发调度方案" actions={<Button icon={CloudCog} variant="primary" onClick={()=>notify("已生成一版模拟调度方案")}>生成方案</Button>} /><div className="summary-strip"><div><FileClock/><span>待审批方案</span><strong>6</strong></div><div><Play/><span>执行中方案</span><strong>12</strong></div><div><Check/><span>今日完成</span><strong>68</strong></div><div><ShieldCheck/><span>边界校核通过率</span><strong>99.1%</strong></div></div><Panel><Filters fields={["方案编号","调度范围","方案状态"]}/><div className="table-wrap"><table><thead><tr><th>方案编号</th><th>调度范围</th><th>调度策略</th><th>执行路径</th><th>电力调节量</th><th>算力规模</th><th>方案状态</th><th>操作</th></tr></thead><tbody>{plans.map(p=><tr key={p[0]}>{p.map((v,i)=><td key={i}>{i===2?<ModuleTag name={v}/>:i===6?<Tag tone={v==="执行中"?"green":v==="待审批"?"orange":"blue"}>{v}</Tag>:v}</td>)}<td className="row-actions"><button>详情</button><button>校核</button><button>更多</button></td></tr>)}</tbody></table></div><Pagination count={36}/></Panel></div>;
}

function ExecutionPage() {
  return <div className="work-page"><PageHeading title="执行监测" subtitle="监测调度指令、资源路由与跨区域执行过程" actions={<Button icon={RefreshCw} variant="primary">刷新状态</Button>}/><div className="execution-grid"><Panel title="当前执行链路" className="process-panel"><div className="process-flow">{[["任务接入","完成"],["资源匹配","完成"],["方案校核","完成"],["指令下发","执行中"],["结果确认","待执行"]].map((s,i)=><div className={s[1]==="执行中"?"current":s[1]==="完成"?"done":""} key={s[0]}><i>{s[1]==="完成"?<Check/>:i+1}</i><strong>{s[0]}</strong><span>{s[1]}</span></div>)}</div><div className="execution-detail"><div><span>当前任务</span><strong>TASK-20260817-031</strong></div><div><span>执行方案</span><strong>PLAN-0817-018</strong></div><div><span>调度路径</span><strong>杭州任务中心 → 庆阳算力集群</strong></div><div><span>当前进度</span><strong>68%</strong></div></div><div className="progress-large"><i style={{width:"68%"}}/></div></Panel><Panel title="实时执行日志" className="log-panel"><div className="logs"><p><time>14:29:52.163</time><Tag tone="green">INFO</Tag><span>目标资源池容量校验通过，可用 GPU 384 张</span></p><p><time>14:29:51.824</time><Tag tone="green">INFO</Tag><span>甘肃新能源出力校核通过，可承接负荷 0.48 MW</span></p><p><time>14:29:49.502</time><Tag tone="blue">STEP</Tag><span>向云霆平台下发任务调度准备指令</span></p><p><time>14:29:47.088</time><Tag tone="green">INFO</Tag><span>浙江侧负荷管理系统已确认调节窗口</span></p><p><time>14:29:45.316</time><Tag tone="orange">WAIT</Tag><span>等待目标算力节点资源锁定回执</span></p></div></Panel></div><Panel title="执行任务列表"><div className="table-wrap"><table><thead><tr><th>任务编号</th><th>调度策略</th><th>调度路径</th><th>执行进度</th><th>当前阶段</th><th>开始时间</th><th>状态</th><th>操作</th></tr></thead><tbody>{tasks.slice(0,4).map((t,i)=><tr key={t[0]}><td>{t[0]}</td><td><ModuleTag name={t[4]}/></td><td>{t[2]} → {t[3]}</td><td><div className="progress-cell"><i style={{width:`${[68,43,12,100][i]}%`}}/><span>{[68,43,12,100][i]}%</span></div></td><td>{["指令下发","资源准备","方案校核","结果确认"][i]}</td><td>{t[7]}</td><td><Tag tone={i===3?"blue":"green"}>{i===3?"已完成":"执行中"}</Tag></td><td className="row-actions"><button>监测</button><button>日志</button></td></tr>)}</tbody></table></div></Panel></div>;
}

function DataAccessPage({ notify }) {
  const groups = [
    [ListChecks, "任务数据", 25, "触发 / 1min"],
    [Cpu, "算力数据", 27, "1min"],
    [Network, "网络数据", 7, "1min / 固定"],
    [Zap, "电力数据", 5, "触发"],
    [RefreshCw, "反馈数据", 2, "回传"]
  ];
  const fields = [
    ["任务类", "任务类型", "/", "变更触发", "业务级", "用户输入", "任务调度", "已接入"],
    ["任务类", "任务执行状态", "枚举", "1min", "任务级", "算力管控平台", "执行监测", "已接入"],
    ["任务类", "任务平均排队等待时长", "min", "5min", "业务级", "算力管控平台", "运行控制", "已接入"],
    ["算力类", "GPU算力总规模", "PFLOPS", "变更触发", "区域级", "算力管控平台", "资源管理", "已接入"],
    ["算力类", "可用算力资源量", "PFLOPS", "1min", "节点级", "算力管控平台", "资源匹配", "已接入"],
    ["算力类", "算力节点实时负载率", "%", "1min", "节点级", "算力管控平台", "资源监控", "已接入"],
    ["网络类", "跨区域网络端到端时延", "ms", "固定值", "区域级", "算力管控平台", "网络评估", "已接入"],
    ["网络类", "跨区域网络丢包率", "%", "固定值", "区域级", "算力管控平台", "网络评估", "已接入"],
    ["电力类", "电力互动信号", "/", "变更触发", "数据中心级", "电力系统", "调度触发", "待联调"],
    ["反馈类", "指令执行结束时间", "/", "回传", "数据中心级", "算力管控平台", "结果确认", "已接入"]
  ];
  return <div className="work-page">
    <PageHeading title="数据接入" subtitle="管理外部平台数据目录、采集周期、字段映射与接入质量" actions={<Button icon={Plus} variant="primary" onClick={()=>notify("已打开数据字段配置")}>新增字段</Button>} />
    <div className="summary-strip"><div><Database/><span>输入字段</span><strong>66</strong></div><div><SquareStack/><span>数据大类</span><strong>5</strong></div><div><RefreshCw/><span>核心采集周期</span><strong>1 min</strong></div><div><ShieldCheck/><span>数据完整率</span><strong>98.7%</strong></div></div>
    <Panel title="接入分类" extra={<span className="data-update-time">最近同步 14:29:55</span>}><div className="ingest-groups">{groups.map(([Icon, name, count, cycle]) => <article key={name}><Icon/><div><strong>{name}</strong><span>{count} 个字段</span></div><em>{cycle}</em></article>)}</div></Panel>
    <Panel title="字段接入目录" extra={<div className="segmented"><button className="active">输入字段</button><button>字段映射</button><button>采集规则</button><button>数据质量</button></div>}>
      <Filters fields={["字段名称", "数据大类", "接入状态"]}/>
      <div className="table-wrap"><table><thead><tr><th>数据大类</th><th>数据字段</th><th>单位</th><th>采集周期</th><th>数据颗粒度</th><th>数据来源</th><th>平台用途</th><th>接入状态</th><th>操作</th></tr></thead><tbody>{fields.map(row => <tr key={row[1]}>{row.map((value,index)=><td key={index}>{index===7?<Tag tone={value==="已接入"?"green":"orange"}>{value}</Tag>:value}</td>)}<td className="row-actions"><button>映射</button><button>规则</button><button>日志</button></td></tr>)}</tbody></table></div><Pagination count={66}/>
    </Panel>
  </div>;
}

function InterfacesPage({ notify }) {
  const outputs = [
    ["REQ-26081731", "电信云霆", "GS-QY-01", "低碳优先", "0.91", "15 min", "已回传", "14:29:52"],
    ["REQ-26081730", "联通星罗", "LF-KF-02", "速度优先", "0.89", "10 min", "已回传", "14:22:41"],
    ["REQ-26081729", "电信云霆", "ZJ-HZ-03", "价格优先", "0.86", "15 min", "待确认", "14:18:23"]
  ];
  return <div className="work-page">
    <PageHeading title="接口管理" subtitle="管理外部平台、国网系统及调度结果输出接口" actions={<Button icon={Plus} variant="primary" onClick={()=>notify("已打开接口接入配置")}>新增接口</Button>}/>
    <div className="summary-strip"><div><Network/><span>接口总数</span><strong>18</strong></div><div><Check/><span>正常接口</span><strong>16</strong></div><div><AlertTriangle/><span>待联调</span><strong>2</strong></div><div><Gauge/><span>平均响应</span><strong>41 ms</strong></div></div>
    <Panel title="接口运行状态"><Filters fields={["接口名称","所属平台","健康状态"]}/><div className="table-wrap"><table><thead><tr><th>接口名称</th><th>所属平台</th><th>接口类别</th><th>协议</th><th>延迟(ms)</th><th>健康状态</th><th>最近更新时间</th><th>操作</th></tr></thead><tbody>{interfaces.map(i=><tr key={i[0]}>{i.map((v,n)=><td key={n}>{n===5?<Tag tone={v==="正常"?"green":"orange"}>{v}</Tag>:v}</td>)}<td className="row-actions"><button>测试</button><button>配置</button><button>日志</button></td></tr>)}</tbody></table></div><Pagination count={18}/></Panel>
    <Panel title="调度结果输出记录" extra={<span className="output-live"><i/>实时输出</span>}><div className="table-wrap"><table><thead><tr><th>请求ID</th><th>目标平台</th><th>推荐站点</th><th>推荐理由</th><th>综合评分</th><th>有效期</th><th>输出状态</th><th>输出时间</th><th>操作</th></tr></thead><tbody>{outputs.map(row=><tr key={row[0]}>{row.map((value,index)=><td key={index}>{index===6?<Tag tone={value==="已回传"?"green":"orange"}>{value}</Tag>:value}</td>)}<td className="row-actions"><button>详情</button><button>重发</button></td></tr>)}</tbody></table></div></Panel>
  </div>;
}

function MetricTrendChart({ values, unit, color = "#1677ff" }) {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const minimumPadding = unit === "元/kWh" ? 0.03 : unit === "ms" ? 2 : 120;
  const padding = Math.max((maxValue - minValue) * 0.18, minimumPadding);
  const low = minValue - padding;
  const high = maxValue + padding;
  const points = values.map((value,index) => {
    const x = 58 + index * (620 / (values.length - 1));
    const y = 218 - ((value - low) / (high - low)) * 158;
    return [x,y];
  });
  const path = points.map(([x,y],index)=>`${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const format = value => unit === "元/kWh" ? value.toFixed(2) : Math.round(value).toLocaleString("zh-CN");
  return <div className="metric-trend-chart"><svg viewBox="0 0 720 250" role="img" aria-label={`24小时${unit}趋势曲线`}>
    {[60,100,140,180,218].map((y,index)=><g key={y}><line x1="58" y1={y} x2="678" y2={y}/><text x="50" y={y+4} textAnchor="end">{format(high-index*(high-low)/4)}</text></g>)}
    <path d={path} style={{stroke:color}}/>
    {points.map(([x,y],index)=><circle key={index} cx={x} cy={y} r="3" style={{fill:color}}/>)}
    {[0,3,6,9,11].map(index=><text key={index} x={points[index][0]} y="241" textAnchor="middle">{["00:00","06:00","12:00","18:00","24:00"][[0,3,6,9,11].indexOf(index)]}</text>)}
  </svg><div className="chart-current"><span>最新值</span><strong>{format(values.at(-1))} {unit}</strong><small>数据更新时间 14:30:00</small></div></div>;
}

function PowerResourceView() {
  const profiles = {
    浙江: { source:"浙江电网数据接口", load:"61,240 MW", generation:"57,860 MW", renewable:"12,460 MW", price:"0.62 元/kWh", renewableRate:"21.5%", curves:{load:[48620,46280,45140,46870,51260,56840,60420,63180,64620,63810,62040,61240],generation:[45810,44260,43820,45600,49310,53580,56640,58820,60140,59460,58120,57860],renewable:[8120,7950,8420,9730,11240,12880,14120,14960,14540,13820,13040,12460],price:[.48,.45,.43,.46,.52,.58,.64,.69,.72,.68,.65,.62]}},
    甘肃: { source:"甘肃电网数据接口", load:"18,420 MW", generation:"20,860 MW", renewable:"11,680 MW", price:"0.34 元/kWh", renewableRate:"56.0%", curves:{load:[14220,13680,13440,13960,15180,16920,18140,19260,19840,19520,18840,18420],generation:[17420,16980,17120,18040,19420,21180,22640,23820,23460,22840,21620,20860],renewable:[8840,8610,8920,9780,10820,12140,13360,14120,13640,12880,12120,11680],price:[.29,.27,.26,.28,.31,.34,.36,.38,.39,.37,.35,.34]}},
    北京: { source:"北京电网数据接口", load:"16,780 MW", generation:"7,420 MW", renewable:"1,180 MW", price:"0.68 元/kWh", renewableRate:"15.9%", curves:{load:[11840,11260,10920,11480,12860,14620,15840,17120,18060,17740,17080,16780],generation:[6120,5980,5920,6180,6640,7180,7540,7810,7930,7780,7560,7420],renewable:[620,590,610,740,920,1140,1320,1480,1420,1360,1240,1180],price:[.52,.49,.47,.50,.57,.64,.70,.75,.78,.74,.71,.68]}},
    廊坊: { source:"廊坊电网数据接口", load:"4,960 MW", generation:"4,380 MW", renewable:"1,020 MW", price:"0.55 元/kWh", renewableRate:"23.3%", curves:{load:[3610,3440,3380,3520,3980,4420,4760,5180,5360,5290,5080,4960],generation:[3420,3310,3280,3460,3820,4190,4510,4680,4720,4610,4450,4380],renewable:[680,650,670,760,890,1040,1180,1260,1210,1160,1080,1020],price:[.44,.41,.40,.42,.47,.52,.57,.61,.63,.60,.57,.55]}}
  };
  const metrics = { load:["区域负荷","MW","#1677ff"], generation:["区域发电量","MW","#18a66f"], renewable:["新能源发电量","MW","#30a6c9"], price:["电价","元/kWh","#ef8b22"] };
  const [region,setRegion] = useState("浙江");
  const [metric,setMetric] = useState("load");
  const selected = profiles[region];
  const [metricLabel,unit,color] = metrics[metric];
  return <>
    <div className="summary-strip"><div><Activity/><span>当前区域负荷</span><strong>{selected.load}</strong></div><div><Zap/><span>当前区域发电量</span><strong>{selected.generation}</strong></div><div><Leaf/><span>新能源发电量</span><strong>{selected.renewable}</strong></div><div><Gauge/><span>当前电价</span><strong>{selected.price}</strong></div></div>
    <Panel title="区域电力运行趋势" extra={<div className="chart-controls"><select value={region} onChange={event=>setRegion(event.target.value)} aria-label="选择区域">{Object.keys(profiles).map(name=><option key={name}>{name}</option>)}</select><select value={metric} onChange={event=>setMetric(event.target.value)} aria-label="选择电力指标">{Object.entries(metrics).map(([value,[label]])=><option value={value} key={value}>{label}</option>)}</select></div>}><div className="trend-chart-heading"><div><span>监测区域</span><strong>{region}</strong></div><div><span>当前指标</span><strong>{metricLabel}</strong></div><div><span>数据来源</span><strong>{selected.source}</strong></div><Tag tone="green">实时接入</Tag></div><MetricTrendChart values={selected.curves[metric]} unit={unit} color={color}/></Panel>
    <Panel title="区域电力状态"><div className="table-wrap"><table><thead><tr><th>区域</th><th>数据来源</th><th>区域负荷</th><th>区域发电量</th><th>新能源发电量</th><th>新能源占比</th><th>当前电价</th><th>数据状态</th></tr></thead><tbody>{Object.entries(profiles).map(([name,item])=><tr className={name===region?"selected-row":""} key={name}><td><strong>{name}</strong></td><td>{item.source}</td><td>{item.load}</td><td>{item.generation}</td><td>{item.renewable}</td><td>{item.renewableRate}</td><td>{item.price}</td><td><Tag tone="green">正常</Tag></td></tr>)}</tbody></table></div></Panel>
  </>;
}

function NetworkLinkView({ notify }) {
  const [source,setSource] = useState(managedCenters[0].id);
  const [target,setTarget] = useState(managedCenters[2].id);
  const [range,setRange] = useState("近1小时");
  const sourceIndex = managedCenters.findIndex(center=>center.id===source);
  const targetIndex = managedCenters.findIndex(center=>center.id===target);
  const sourceCenter = managedCenters[sourceIndex];
  const targetCenter = managedCenters[targetIndex];
  const distanceFactor = Math.abs(sourceIndex-targetIndex)+1;
  const latency = 8 + distanceFactor * 7;
  const bandwidth = distanceFactor > 3 ? 20 : 40;
  const loss = (0.01 + distanceFactor * 0.004).toFixed(3);
  const jitter = (1.2 + distanceFactor * .45).toFixed(1);
  const values = [latency+3,latency+1,latency+4,latency+2,latency-1,latency+2,latency,latency+1,latency-2,latency,latency+1,latency];
  const chooseSource = event => {
    const nextSource = event.target.value;
    setSource(nextSource);
    if (nextSource === target) setTarget(managedCenters.find(center=>center.id!==nextSource).id);
  };
  return <>
    <Panel title="链路查询"><div className="link-query-bar"><label><span>源算力中心</span><select value={source} onChange={chooseSource}>{managedCenters.map(center=><option value={center.id} key={center.id}>{center.name} · {center.region}</option>)}</select></label><Route/><label><span>目标算力中心</span><select value={target} onChange={event=>setTarget(event.target.value)}>{managedCenters.filter(center=>center.id!==source).map(center=><option value={center.id} key={center.id}>{center.name} · {center.region}</option>)}</select></label><label><span>观测时段</span><select value={range} onChange={event=>setRange(event.target.value)}><option>近1小时</option><option>近6小时</option><option>近24小时</option></select></label><Button icon={Search} variant="primary" onClick={()=>notify(`已查询 ${sourceCenter.name} 至 ${targetCenter.name} 链路`)}>查询链路</Button></div></Panel>
    <div className="summary-strip link-summary"><div><Gauge/><span>端到端时延</span><strong>{latency} ms</strong></div><div><Activity/><span>可用带宽</span><strong>{bandwidth} Gbps</strong></div><div><Network/><span>丢包率</span><strong>{loss}%</strong></div><div><ShieldCheck/><span>时延抖动</span><strong>{jitter} ms</strong></div></div>
    <Panel title="链路监测结果" extra={<Tag tone="green">链路正常</Tag>}><div className="link-result-heading"><div><span>源端</span><strong>{sourceCenter.name}</strong><small>{sourceCenter.id} · {sourceCenter.region}</small></div><Route/><div><span>目标端</span><strong>{targetCenter.name}</strong><small>{targetCenter.id} · {targetCenter.region}</small></div><div><span>查询范围</span><strong>{range}</strong><small>动态测量结果</small></div></div><MetricTrendChart values={values} unit="ms" color="#30a6c9"/></Panel>
  </>;
}

function ResourceWorkspacePage({ section = "compute", openModal, notify }) {
  const tab = section;
  const nodes = [
    ["甘肃庆阳算力集群","甘肃 · 庆阳","4.8 PFLOPS","43%","0.82 MW","正常","电信云霆"],
    ["浙江杭州算力节点","浙江 · 杭州","3.2 PFLOPS","78%","0.34 MW","正常","电信云霆"],
    ["北京亦庄算力节点","北京 · 亦庄","5.1 PFLOPS","77%","0.28 MW","偏高","联通星罗"],
    ["河北廊坊算力节点","河北 · 廊坊","4.5 PFLOPS","54%","0.41 MW","正常","联通星罗"]
  ];
  return <div className="work-page"><PageHeading title={{compute:"算力资源",power:"电力资源",network:"网络链路",managed:"纳管配置"}[tab]} subtitle={{compute:"查看已纳管算力中心及节点实时资源状态",power:"查看各区域负荷、发电、新能源出力和电价信息",network:"按源端和目标端查询算力中心之间的实时网络状态",managed:"维护算力中心资源与末端控制通道"}[tab]} actions={tab==="managed"?<Button icon={Plus} variant="primary" onClick={openModal}>新增算力中心</Button>:<Button icon={RefreshCw} variant="primary" onClick={()=>notify("资源状态已同步")}>同步资源</Button>}/>
    {tab==="compute"&&<><div className="summary-strip"><div><Cpu/><span>算力中心</span><strong>7</strong></div><div><HardDrive/><span>算力节点</span><strong>24</strong></div><div><Gauge/><span>平均负载</span><strong>63.1%</strong></div><div><ShieldCheck/><span>健康资源</span><strong>96.4%</strong></div></div><Panel title="纳管算力中心"><div className="resource-grid">{nodes.map(n=><article className="resource-node" key={n[0]}><div className="resource-icon"><HardDrive/></div><div className="resource-title"><div><h3>{n[0]}</h3><span>{n[1]}</span></div><Tag tone={n[5]==="正常"?"green":"orange"}>{n[5]}</Tag></div><dl><div><dt>可用算力</dt><dd>{n[2]}</dd></div><div><dt>当前负载</dt><dd>{n[3]}</dd></div><div><dt>可转移任务负荷</dt><dd>{n[4]}</dd></div><div><dt>控制通道</dt><dd>{n[6]}</dd></div></dl><div className="node-meter"><i style={{width:n[3]}}/></div><button>查看资源详情 <ChevronRight/></button></article>)}</div></Panel></>}
    {tab==="power"&&<PowerResourceView/>}
    {tab==="network"&&<NetworkLinkView notify={notify}/>}
    {tab==="managed"&&<><div className="summary-strip"><div><Grid2X2/><span>纳管区域</span><strong>4</strong></div><div><HardDrive/><span>算力中心</span><strong>7</strong></div><div><Cpu/><span>算力节点</span><strong>24</strong></div><div><Network/><span>末端控制通道</span><strong>2</strong></div></div><Panel><Filters fields={["算力中心名称","所属区域","运行状态"]}/><DataToolbar primaryLabel="新增算力中心" onPrimary={openModal} withStop/><div className="table-wrap"><table><thead><tr><th>算力中心 / 节点</th><th>所属区域</th><th>资源类型</th><th>算力控制通道</th><th>控制接口状态</th><th>可用算力</th><th>可转移任务负荷</th><th>运行状态</th><th>操作</th></tr></thead><tbody>{managedCenters.map(center=><tr key={center.id}><td><strong>{center.name}</strong><small className="cell-sub">{center.id}</small></td><td>{center.region}</td><td>{center.type}</td><td>{center.controlPlatform}<small className="cell-sub">指令下发 / 状态回传</small></td><td><Tag tone="green">{center.controlStatus}</Tag></td><td>{center.compute}</td><td>{center.taskLoad}</td><td><Tag tone="green">{center.status}</Tag></td><td className="row-actions"><button>编辑</button><button>资源</button><button>停用</button></td></tr>)}</tbody></table></div><Pagination count={7}/></Panel></>}
  </div>;
}

function AlgorithmServicesView({ notify }) {
  const [selectedId, setSelectedId] = useState(algorithmServices[0].id);
  const selected = algorithmServices.find(service => service.id === selectedId) || algorithmServices[0];
  return <>
    <div className="summary-strip"><div><CloudCog/><span>已注册服务</span><strong>3</strong></div><div><Check/><span>运行正常</span><strong>3</strong></div><div><Activity/><span>今日调用</span><strong>428</strong></div><div><Gauge/><span>综合成功率</span><strong>99.4%</strong></div></div>
    <div className="algorithm-service-layout">
      <Panel title="算法服务注册" extra={<span className="data-update-time">最近同步 14:29:55</span>}><div className="algorithm-service-list">{algorithmServices.map((service,index)=><button type="button" className={service.id===selectedId?"active":""} onClick={()=>setSelectedId(service.id)} key={service.id}><i>{index===0?<Route/>:index===1?<Leaf/>:<Workflow/>}</i><div><strong>{service.name}</strong><span>{service.category} · {service.version}</span><small>{service.description}</small></div><Tag tone="green">{service.status}</Tag><ChevronRight/></button>)}</div></Panel>
      <Panel title="服务详情" extra={<Tag tone="green">{selected.status}</Tag>}><div className="algorithm-service-detail"><div className="service-identity"><CloudCog/><div><strong>{selected.name}</strong><span>{selected.id}</span></div></div><dl><div><dt>服务地址</dt><dd>{selected.endpoint}</dd></div><div><dt>部署方式</dt><dd>{selected.deployment}</dd></div><div><dt>鉴权方式</dt><dd>{selected.auth}</dd></div><div><dt>超时时间</dt><dd>{selected.timeout}</dd></div><div><dt>最近调用</dt><dd>{selected.lastCall}</dd></div><div><dt>平均响应</dt><dd>{selected.latency}</dd></div><div><dt>调用成功率</dt><dd>{selected.successRate}</dd></div><div><dt>接口版本</dt><dd>{selected.version}</dd></div></dl><div className="service-actions"><Button icon={Activity} onClick={()=>notify(`${selected.name}连通性测试通过`)}>连通性测试</Button><Button icon={Settings} variant="primary" onClick={()=>notify(`已打开${selected.name}配置`)}>配置服务</Button></div></div></Panel>
    </div>
    <Panel title="最近调用记录"><div className="table-wrap"><table><thead><tr><th>调用编号</th><th>算法服务</th><th>业务阶段</th><th>关联任务</th><th>开始时间</th><th>响应时间</th><th>调用结果</th><th>操作</th></tr></thead><tbody>{[["CALL-CARBON-260817-031","低碳迁移服务","方案生成","TASK-20260817-031","14:29:45","1.8 s","成功"],["CALL-MATCH-260817-031","供需匹配服务","资源匹配","TASK-20260817-031","14:29:41","420 ms","成功"],["CALL-COLLAB-260817-030","协同计算服务","方案生成","TASK-20260817-030","14:22:32","2.3 s","成功"],["CALL-MATCH-260817-030","供需匹配服务","资源匹配","TASK-20260817-030","14:22:28","390 ms","成功"]].map(row=><tr key={row[0]}>{row.map((value,index)=><td key={index}>{index===6?<Tag tone="green">{value}</Tag>:value}</td>)}<td className="row-actions"><button>输入摘要</button><button>输出摘要</button><button>日志</button></td></tr>)}</tbody></table></div></Panel>
  </>;
}

function AccessWorkspacePage({ section = "catalog", notify }) {
  const tab = section;
  const fields=[["任务类","任务类型","/","变更触发","用户输入","已接入"],["算力类","可用算力资源量","PFLOPS","1 min","算力管控平台","已接入"],["算力类","节点实时负载率","%","1 min","算力管控平台","已接入"],["网络类","端到端时延","ms","固定值","算力管控平台","已接入"],["电力类","电力互动信号","/","变更触发","电力系统","待联调"],["反馈类","指令执行结束时间","/","回传","算力管控平台","已接入"]];
  const mappings=[["task_type","任务类型","STRING","枚举转换","已发布"],["available_compute","可用算力资源量","DECIMAL","单位统一为 PFLOPS","已发布"],["grid_signal","电力互动信号","OBJECT","标准事件模型","待审核"],["execution_end_time","指令执行结束时间","DATETIME","ISO 8601","已发布"]];
  return <div className="work-page"><PageHeading title={{catalog:"数据目录",mapping:"字段映射",interfaces:"接口配置",algorithms:"算法服务",monitor:"接入监测"}[tab]} subtitle={{catalog:"管理平台输入输出数据字段及采集要求",mapping:"维护外部字段与平台标准字段映射",interfaces:"配置电网系统与算力管控平台接口",algorithms:"注册并监测供需匹配、低碳迁移及协同计算API服务",monitor:"监测数据质量、接口调用和接入异常"}[tab]} actions={<Button icon={Plus} variant="primary" onClick={()=>notify(tab==="algorithms"?"已打开算法服务注册":"已打开接入配置")}>{tab==="algorithms"?"注册服务":"新增配置"}</Button>}/>
    {tab==="catalog"&&<><div className="summary-strip"><div><Database/><span>输入字段</span><strong>66</strong></div><div><SquareStack/><span>数据大类</span><strong>5</strong></div><div><RefreshCw/><span>核心采集周期</span><strong>1 min</strong></div><div><ShieldCheck/><span>数据完整率</span><strong>98.7%</strong></div></div><Panel title="字段接入目录"><Filters fields={["字段名称","数据大类","接入状态"]}/><div className="table-wrap"><table><thead><tr><th>数据大类</th><th>数据字段</th><th>单位</th><th>采集周期</th><th>数据来源</th><th>接入状态</th><th>操作</th></tr></thead><tbody>{fields.map(r=><tr key={r[1]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><Tag tone={r[5]==="已接入"?"green":"orange"}>{r[5]}</Tag></td><td className="row-actions"><button>详情</button><button>规则</button></td></tr>)}</tbody></table></div><Pagination count={66}/></Panel></>}
    {tab==="mapping"&&<Panel title="标准字段映射"><Filters fields={["外部字段","标准字段","发布状态"]}/><div className="table-wrap"><table><thead><tr><th>外部字段</th><th>平台标准字段</th><th>数据类型</th><th>转换规则</th><th>状态</th><th>操作</th></tr></thead><tbody>{mappings.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i}>{i===4?<Tag tone={v==="已发布"?"green":"orange"}>{v}</Tag>:v}</td>)}<td className="row-actions"><button>编辑</button><button>校验</button></td></tr>)}</tbody></table></div></Panel>}
    {tab==="interfaces"&&<><div className="summary-strip"><div><Network/><span>接口总数</span><strong>18</strong></div><div><Check/><span>正常接口</span><strong>16</strong></div><div><AlertTriangle/><span>待联调</span><strong>2</strong></div><div><Gauge/><span>平均响应</span><strong>41 ms</strong></div></div><Panel title="接口配置"><Filters fields={["接口名称","所属平台","健康状态"]}/><div className="table-wrap"><table><thead><tr><th>接口名称</th><th>所属系统</th><th>接口类别</th><th>协议</th><th>延迟</th><th>健康状态</th><th>最近更新</th><th>操作</th></tr></thead><tbody>{interfaces.map(i=><tr key={i[0]}>{i.map((v,n)=><td key={n}>{n===5?<Tag tone={v==="正常"?"green":"orange"}>{v}</Tag>:v}</td>)}<td className="row-actions"><button>测试</button><button>配置</button><button>日志</button></td></tr>)}</tbody></table></div><Pagination count={18}/></Panel></>}
    {tab==="algorithms"&&<AlgorithmServicesView notify={notify}/>}
    {tab==="monitor"&&<><div className="summary-strip"><div><ShieldCheck/><span>数据完整率</span><strong>98.7%</strong></div><div><Activity/><span>今日调用</span><strong>12,846</strong></div><div><Gauge/><span>成功率</span><strong>99.4%</strong></div><div><AlertTriangle/><span>接入异常</span><strong>3</strong></div></div><div className="three-panels"><Panel title="电网数据接入"><div className="health-list">{interfaces.slice(2,5).map(i=><div key={i[0]}><span className="health-dot"/><div><strong>{i[0]}</strong><small>{i[1]} · 最近更新 {i[6]}</small></div><Tag tone="green">{i[5]}</Tag><em>{i[4]} ms</em></div>)}</div></Panel><Panel title="算力控制接口"><div className="health-list">{interfaces.slice(0,2).map(i=><div key={i[0]}><span className="health-dot"/><div><strong>{i[0]}</strong><small>{i[1]} · 指令与回执</small></div><Tag tone="green">{i[5]}</Tag><em>{i[4]} ms</em></div>)}</div></Panel><Panel title="最近异常"><div className="timeline"><div><i className="orange"/><strong>北京调控指令响应延迟升高</strong><span>14:18:36 · 已自动恢复</span><Tag tone="orange">一般</Tag></div><div><i className="blue"/><strong>电力互动信号字段待联调</strong><span>13:42:08 · 等待确认</span><Tag tone="blue">提示</Tag></div></div></Panel></div></>}
  </div>;
}

function SystemWorkspacePage({ section = "users" }) {
  const titles = {
    users: ["用户权限", "维护平台用户、角色及数据访问范围"],
    strategy: ["策略配置", "维护调度评估权重、执行阈值和安全边界"],
    dictionary: ["数据字典", "维护平台通用编码、状态和业务枚举"],
    audit: ["审计日志", "追溯关键配置、任务操作和接口调用记录"]
  };
  const [title, subtitle] = titles[section] || titles.users;
  const users = [["dispatch_admin","调度管理员","调度管理员","平台运营中心","启用","2026-08-17 13:58"],["resource_auditor","纳管审核员","审核人员","技术管理部","启用","2026-08-17 10:22"],["interface_ops","接口运维员","运维人员","平台运维部","启用","2026-08-16 18:36"],["operation_viewer","运行查看员","只读用户","项目验证组","停用","2026-08-12 09:15"]];
  const dictionaries = [["TASK_STATUS","任务状态","待评估、待确认、执行中、已完成、异常终止","启用"],["TRIGGER_TYPE","触发类型","电网指令、主动调度、平台请求、人工触发","启用"],["RESOURCE_STATUS","资源状态","在线、离线、维护、受限","启用"],["ALARM_LEVEL","告警级别","紧急、重要、一般、提示","启用"]];
  const audits = [["2026-08-17 14:29:52","系统自动","TASK-20260817-031","控制指令受理回执入库","成功"],["2026-08-17 14:26:32","dispatch_admin","PLAN-0817-018","确认推荐调度方案","成功"],["2026-08-17 14:18:36","interface_ops","北京电网接口","执行接口连通性测试","成功"],["2026-08-17 13:42:08","resource_auditor","DC-GS-QY-01","更新算力资源边界","成功"]];

  return <div className="work-page"><PageHeading title={title} subtitle={subtitle} actions={section!=="audit"?<Button icon={Plus} variant="primary">新增配置</Button>:<Button icon={Download}>导出日志</Button>}/>
    {section==="users"&&<Panel title="平台用户"><div className="data-toolbar"><Button icon={Plus} variant="outline">新增用户</Button><Button icon={Download}>导出</Button></div><div className="table-wrap"><table><thead><tr><th>用户名</th><th>姓名</th><th>角色</th><th>所属机构</th><th>状态</th><th>最近登录</th><th>操作</th></tr></thead><tbody>{users.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i}>{i===4?<Tag tone={v==="启用"?"green":"gray"}>{v}</Tag>:v}</td>)}<td className="row-actions"><button>编辑</button><button>授权</button></td></tr>)}</tbody></table></div></Panel>}
    {section==="strategy"&&<><div className="summary-strip"><div><SlidersHorizontal/><span>启用策略</span><strong>6</strong></div><div><Gauge/><span>响应时限</span><strong>15 min</strong></div><div><Network/><span>协同网络阈值</span><strong>20 ms</strong></div><div><ShieldCheck/><span>安全规则</span><strong>12</strong></div></div><Panel title="调度评估参数"><div className="parameter-grid">{[["低碳收益权重","35%","综合评分"],["资源可用性权重","30%","综合评分"],["执行成本权重","20%","综合评分"],["网络质量权重","15%","综合评分"],["最大调节偏差","5%","结果校核"],["指令确认超时","60 s","执行控制"]].map(([name,value,group])=><article key={name}><span>{group}</span><strong>{name}</strong><div><b>{value}</b><button>编辑</button></div></article>)}</div></Panel><Panel title="算法调用与路由规则" extra={<Tag tone="blue">单主算法路由</Tag>}><div className="table-wrap"><table><thead><tr><th>优先级</th><th>适用阶段</th><th>判断条件</th><th>调用服务</th><th>调用方式</th><th>状态</th><th>操作</th></tr></thead><tbody>{[["1","候选资源筛选","任务与资源基本约束校验","供需匹配服务","前置调用","启用"],["2","方案生成","任务可迁移或可延迟，满足迁移边界","低碳迁移服务","主算法","启用"],["3","方案生成","任务可拆分且网络时延不高于阈值","协同计算服务","主算法","启用"]].map(row=><tr key={row[0]}>{row.map((value,index)=><td key={index}>{index===5?<Tag tone="green">{value}</Tag>:index===4?<Tag tone={value==="前置调用"?"blue":"orange"}>{value}</Tag>:value}</td>)}<td className="row-actions"><button>编辑</button><button>日志</button></td></tr>)}</tbody></table></div><div className="algorithm-call-note"><Route/><span>供需匹配服务完成预筛选后，任务仅进入一个主算法服务；主算法不可用或返回不可执行时，由平台重新评估并路由。</span></div></Panel></>}
    {section==="dictionary"&&<Panel title="业务数据字典"><Filters fields={["字典编码","字典名称","运行状态"]}/><div className="table-wrap"><table><thead><tr><th>字典编码</th><th>字典名称</th><th>字典项</th><th>状态</th><th>操作</th></tr></thead><tbody>{dictionaries.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i}>{i===3?<Tag tone="green">{v}</Tag>:v}</td>)}<td className="row-actions"><button>字典项</button><button>编辑</button></td></tr>)}</tbody></table></div></Panel>}
    {section==="audit"&&<Panel title="关键操作记录"><Filters fields={["操作对象","操作人员","执行结果"]}/><div className="table-wrap"><table><thead><tr><th>操作时间</th><th>操作人员</th><th>操作对象</th><th>操作内容</th><th>执行结果</th><th>操作</th></tr></thead><tbody>{audits.map(r=><tr key={r[0]+r[2]}>{r.map((v,i)=><td key={i}>{i===4?<Tag tone="green">{v}</Tag>:v}</td>)}<td className="row-actions"><button>详情</button></td></tr>)}</tbody></table></div><Pagination count={186}/></Panel>}
  </div>;
}

function ManagedModal({ close, notify }) {
  const [collab, setCollab] = useState(true);
  const [migration, setMigration] = useState(true);
  return <div className="modal-backdrop" role="presentation" onMouseDown={close}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><h2 id="modal-title">新增算力中心</h2><p>纳管算力资源，并绑定资源查询、指令下发和状态回传通道</p></div><button className="icon-button" type="button" aria-label="关闭" onClick={close}><X/></button></div><div className="modal-body"><div className="form-grid"><label><span>算力中心 / 节点名称</span><input placeholder="请输入算力中心或节点名称"/></label><label><span>资源编码</span><input value="DC-AUTO-008" readOnly/></label><label><span>所属区域</span><select><option>请选择</option><option>浙江</option><option>甘肃</option><option>北京</option><option>廊坊</option></select></label><label><span>资源类型</span><select><option>算力中心</option><option>算力集群</option><option>算力节点</option></select></label><label><span>可用算力</span><input defaultValue="1.8 PFLOPS"/></label><label><span>可转移任务负荷</span><input defaultValue="0.20 MW"/></label><label><span>算力控制通道</span><select><option>请选择</option><option>电信云霆</option><option>联通星罗</option><option>其他管控平台</option></select></label><label><span>控制接口</span><select><option>请选择已配置接口</option><option>任务指令下发与状态回传接口</option><option>资源查询与锁定接口</option></select></label></div><fieldset><legend>算力资源可用调度能力</legend><button type="button" className={`module-choice ${migration?"selected":""}`} onClick={()=>setMigration(!migration)}><span><Zap/></span><div><strong>任务迁移</strong><small>允许该算力资源作为调出端或执行端参与任务迁移</small></div><i>{migration?<Check/>:null}</i></button><button type="button" className={`module-choice ${collab?"selected":""}`} onClick={()=>setCollab(!collab)}><span><Workflow/></span><div><strong>协同执行</strong><small>在任务与网络条件满足时参与多节点协同编排</small></div><i>{collab?<Check/>:null}</i></button></fieldset><label className="full-field"><span>纳管说明</span><textarea rows="3" placeholder="请输入资源边界、控制范围或运维说明"/></label></div><div className="modal-foot"><Button onClick={close}>取消</Button><Button variant="primary" onClick={()=>{notify("算力中心配置已保存为模拟草稿");close();}}>保存草稿</Button><Button variant="primary" onClick={()=>{notify("算力中心纳管配置已提交审核");close();}}>提交审核</Button></div></div></div>;
}

function TaskModal({ close, notify }) {
  const [trigger, setTrigger] = useState("电网调节信号");
  return <div className="modal-backdrop" role="presentation" onMouseDown={close}><div className="modal task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><h2 id="task-modal-title">新建调度任务</h2><p>从已纳管资源中选择调出地、执行地和候选节点</p></div><button className="icon-button" type="button" aria-label="关闭" onClick={close}><X/></button></div><div className="modal-body"><div className="form-grid"><label><span>任务名称</span><input placeholder="请输入任务名称" defaultValue="北京-廊坊调度验证"/></label><label><span>任务类型</span><select><option>模型训练</option><option>推理服务</option><option>科学计算</option><option>数据处理</option></select></label><label><span>触发方式</span><select value={trigger} onChange={e=>setTrigger(e.target.value)}><option>电网调节信号</option><option>主动资源调度</option><option>外部平台任务</option><option>人工创建</option></select></label><label><span>关联触发编号</span><input placeholder="无则由平台自动生成" defaultValue={trigger === "电网调节信号" ? "DR-BJ-20260817-006" : ""}/></label><label><span>调出区域</span><select><option>北京</option><option>廊坊</option><option>浙江</option><option>甘肃</option></select></label><label><span>执行区域</span><select><option>廊坊</option><option>北京</option><option>浙江</option><option>甘肃</option></select></label><label><span>目标调节量</span><input defaultValue="0.18 MW"/></label><label><span>响应时限</span><input defaultValue="15 min"/></label><label><span>算力需求</span><input defaultValue="64 GPU"/></label><label><span>验证批次（可选）</span><input placeholder="仅用于查询与统计" defaultValue="京津冀验证-01"/></label></div><fieldset><legend>候选执行资源</legend><div className="candidate-nodes"><label><input type="checkbox" defaultChecked/><span><strong>廊坊开发区数据中心</strong><small>可用 2.1 PFLOPS · 负载率 54.2% · 时延 8 ms</small></span></label><label><input type="checkbox" defaultChecked/><span><strong>北京亦庄算力节点</strong><small>可用 1.2 PFLOPS · 支持同域延迟与分布式执行</small></span></label></div></fieldset><div className="form-note"><ShieldCheck/><span>平台将按任务约束、能源状态、算力余量和网络条件生成可执行方案；验证批次不参与决策。</span></div></div><div className="modal-foot"><Button onClick={close}>取消</Button><Button onClick={()=>{notify("任务已保存为模拟草稿");close();}}>保存草稿</Button><Button variant="primary" onClick={()=>{notify("调度任务已创建，正在进行资源匹配");close();}}>创建并评估</Button></div></div></div>;
}

export default function Home() {
  const [active, setActive] = useState("cockpit");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const activeLabel = useMemo(() => {
    for (const item of navItems) {
      if (item.id === active) return item.label;
      const child = item.children?.find(candidate => candidate.id === active);
      if (child) return child.label;
    }
    return "总览";
  }, [active]);
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };

  let content;
  if (active === "cockpit") content = <Cockpit onNavigate={setActive}/>;
  if (active === "triggers") content = <TriggerCenterPage notify={notify}/>;
  if (active === "tasks" || active === "taskInfo") content = <TaskInfoPage openTaskModal={()=>setTaskModalOpen(true)}/>;
  if (active === "taskMonitor") content = <TaskMonitorPage notify={notify}/>;
  if (active === "resources" || active === "computeResources") content = <ResourceWorkspacePage section="compute" openModal={()=>setModalOpen(true)} notify={notify}/>;
  if (active === "powerResources") content = <ResourceWorkspacePage section="power" openModal={()=>setModalOpen(true)} notify={notify}/>;
  if (active === "networkResources") content = <ResourceWorkspacePage section="network" openModal={()=>setModalOpen(true)} notify={notify}/>;
  if (active === "managedResources") content = <ResourceWorkspacePage section="managed" openModal={()=>setModalOpen(true)} notify={notify}/>;
  if (active === "access" || active === "dataCatalog") content = <AccessWorkspacePage section="catalog" notify={notify}/>;
  if (active === "fieldMapping") content = <AccessWorkspacePage section="mapping" notify={notify}/>;
  if (active === "interfaceConfig") content = <AccessWorkspacePage section="interfaces" notify={notify}/>;
  if (active === "algorithmServices") content = <AccessWorkspacePage section="algorithms" notify={notify}/>;
  if (active === "accessMonitor") content = <AccessWorkspacePage section="monitor" notify={notify}/>;
  if (active === "system" || active === "users") content = <SystemWorkspacePage section="users"/>;
  if (active === "strategy") content = <SystemWorkspacePage section="strategy"/>;
  if (active === "dictionary") content = <SystemWorkspacePage section="dictionary"/>;
  if (active === "audit") content = <SystemWorkspacePage section="audit"/>;

  return (
    <div className="app-shell">
      <Sidebar active={active} onSelect={setActive} collapsed={collapsed} onCollapse={()=>setCollapsed(!collapsed)} mobileOpen={mobileOpen} closeMobile={()=>setMobileOpen(false)}/>
      {mobileOpen && <button type="button" className="mobile-scrim" aria-label="关闭导航" onClick={()=>setMobileOpen(false)}/>} 
      <div className="app-main"><Header onMenu={()=>setMobileOpen(true)} activeLabel={activeLabel}/><main className={active === "cockpit" ? "main-cockpit" : "main-work"}>{content}</main></div>
      {modalOpen && <ManagedModal close={()=>setModalOpen(false)} notify={notify}/>}
      {taskModalOpen && <TaskModal close={()=>setTaskModalOpen(false)} notify={notify}/>}
      {toast && <div className="toast"><Check/>{toast}</div>}
    </div>
  );
}

