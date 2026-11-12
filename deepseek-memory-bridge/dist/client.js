window.__ModuleLoader__.load({ id: "dsh-deepseek-memory-bridge", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  BridgeManager: () => BridgeManager,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");

// src/types.ts
var categoryNames = { background: "\u4E2A\u4EBA\u80CC\u666F", preference: "\u7528\u6237\u504F\u597D", learning: "\u5B66\u4E60\u548C\u7814\u7A76", environment: "\u6280\u672F\u73AF\u5883", project: "\u9879\u76EE\u8BB0\u5FC6", knowledge: "\u91CD\u8981\u77E5\u8BC6", unverified: "\u5F85\u9A8C\u8BC1\u4FE1\u606F" };
var defaultLimits = { maxArchiveBytes: 512 * 1024 ** 2, maxExpandedBytes: 1024 ** 3, maxEntryBytes: 512 * 1024 ** 2, maxEntries: 5e3, maxCompressionRatio: 200, maxConversationBytes: 16 * 1024 ** 2 };

// src/client.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var statuses = { candidate: "\u5F85\u5BA1\u6838", confirmed: "\u5DF2\u786E\u8BA4", rejected: "\u5DF2\u62D2\u7EDD", superseded: "\u5DF2\u66F4\u65B0", deleted: "\u5DF2\u5220\u9664", expired: "\u5DF2\u8FC7\u671F" };
var tabs = ["\u5BFC\u5165\u4E2D\u5FC3", "\u8BB0\u5FC6\u7BA1\u7406", "\u5386\u53F2\u8BB0\u5F55", "\u51B2\u7A81\u5BA1\u6838", "\u8BBE\u7F6E\u4E0E\u5907\u4EFD"];
var backupReasons = { manual: "\u624B\u52A8\u5907\u4EFD", "before-import": "\u5BFC\u5165\u524D\u81EA\u52A8\u5907\u4EFD", "after-import": "\u5BFC\u5165\u540E\u81EA\u52A8\u5907\u4EFD", "before-restore": "\u6062\u590D\u524D\u81EA\u52A8\u5907\u4EFD", "before-purge": "\u6C38\u4E45\u79FB\u9664\u524D\u81EA\u52A8\u5907\u4EFD" };
var roleNames = { user: "\u7528\u6237", assistant: "AI \u56DE\u590D", system: "\u7CFB\u7EDF", tool: "\u5DE5\u5177", unknown: "\u672A\u77E5" };
var css = `
.dmb{--ground:#f3f6fa;--surface:#fff;--raised:#f5f6f7;--active:#e9edf1;--border:#e6e9ed;--control:#c5cbd2;--ink:#171b20;--muted:#535d68;--accent:#2862a5;--warn:#92400e;--bad:#a51f2b;--good:#246543;--gap:24px;color:var(--ink);font-family:system-ui,"Microsoft YaHei","Segoe UI",sans-serif;font-size:14px;line-height:1.6;background:var(--ground);border-radius:12px;padding:8px;min-width:0;color-scheme:light;box-sizing:border-box}
.dmb *{box-sizing:border-box}.dmb h1{font-size:22px;line-height:1.3;margin:0;font-weight:600}.dmb h2{font-size:16px;margin:0 0 12px;font-weight:600}.dmb h3{font-size:14px;margin:0 0 6px;font-weight:600}.dmb p{margin:6px 0 12px}.dmb button,.dmb input,.dmb select,.dmb textarea{font:inherit;color:inherit}.dmb button{border:1px solid var(--control);border-radius:6px;background:#fff;padding:5px 12px;min-height:34px;cursor:pointer}.dmb button:disabled{opacity:.5;cursor:wait}.dmb button:hover:enabled{background:var(--raised)}.dmb button.primary{background:var(--ink);color:#fff;border-color:var(--ink)}.dmb button.danger{color:var(--bad)}.dmb button.link{border:0;background:transparent;color:var(--accent);padding:4px 0}.dmb :focus-visible{outline:2px solid var(--accent);outline-offset:2px}.dmb input:not([type=checkbox]),.dmb select,.dmb textarea{border:1px solid var(--control);border-radius:6px;background:#fff;padding:6px 9px;max-width:100%;min-height:34px}.dmb textarea{width:100%;resize:vertical;min-height:110px}.dmb label{display:block;margin-bottom:12px}.dmb label input:not([type=checkbox]),.dmb label select{display:block;width:100%;margin-top:5px}.dmb input[type=checkbox]{width:16px;height:16px;vertical-align:middle;margin-right:8px}.dmb .manual-link{display:inline-flex;align-items:center;color:var(--accent);padding:5px 8px;text-decoration:underline;text-underline-offset:3px}.dmb .brand{display:flex;align-items:center;gap:10px;padding:14px 16px}.dmb .mark{width:32px;height:28px;color:var(--accent);flex:none}.dmb .brand small{color:var(--muted);font-size:12px}.dmb .sheet{border:1px solid var(--border);border-radius:16px;background:var(--surface);padding:24px;min-width:0}.dmb .nav{display:flex;gap:20px;overflow:auto;border-bottom:1px solid var(--border);margin:0 0 20px;white-space:nowrap}.dmb .nav button{border:0;border-radius:0;padding:8px 0 10px;background:none;min-height:42px;color:var(--muted)}.dmb .nav button[aria-selected=true]{border-bottom:2px solid var(--ink);color:var(--ink);font-weight:600}.dmb .muted{color:var(--muted);font-size:12px}.dmb .numbers{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;border-bottom:1px solid var(--border);padding-bottom:20px;margin-bottom:20px}.dmb .numbers span{display:block;color:var(--muted);font-size:12px}.dmb .numbers strong{display:block;font-size:28px;font-weight:400;font-variant-numeric:tabular-nums}.dmb .bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px}.dmb .bar .grow{flex:1;min-width:150px}.dmb .row{border-bottom:1px solid var(--border);padding:16px 0;display:flex;align-items:flex-start;gap:12px}.dmb .row:last-child{border-bottom:0}.dmb .row .body{flex:1;min-width:0}.dmb .row .actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.dmb .content{white-space:pre-wrap;overflow-wrap:anywhere}.dmb .pill{font-size:12px;line-height:1.5;border-radius:4px;background:var(--active);padding:2px 6px;white-space:nowrap;display:inline-block}.dmb .pill.confirmed{background:#e9f5ed;color:var(--good)}.dmb .pill.candidate{background:#fff4dd;color:var(--warn)}.dmb .notice{border:1px solid var(--border);border-radius:8px;padding:12px 14px;margin:12px 0;font-size:13px;overflow-wrap:anywhere}.dmb .notice.error{color:var(--bad);border-color:#efd5d9}.dmb .empty{border:1px dashed var(--control);border-radius:8px;padding:18px;color:var(--muted);margin:14px 0}.dmb .split{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}.dmb .panel{border:1px solid var(--border);border-radius:8px;padding:18px;min-width:0}.dmb .steps{display:flex;gap:18px;flex-wrap:wrap;margin:16px 0}.dmb .step{font-size:12px;color:var(--muted)}.dmb .step b{display:block;color:var(--ink);font-size:14px;font-weight:500}.dmb .file{border:1px dashed var(--control);padding:20px;border-radius:8px;margin:12px 0}.dmb dl{display:grid;grid-template-columns:1fr auto;gap:6px 20px;margin:12px 0}.dmb dt{color:var(--muted)}.dmb dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}.dmb pre,.dmb code{font:12px/1.6 ui-monospace,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}.dmb pre{padding:12px;background:var(--raised);border-radius:6px;max-height:320px;overflow:auto}.dmb blockquote{margin:10px 0;border-left:2px solid var(--control);padding-left:12px;color:var(--muted);white-space:pre-wrap}.dmb .dialog{position:fixed;inset:0;background:#0005;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}.dmb .dialog-inner{background:#fff;color:var(--ink);padding:24px;border-radius:12px;width:min(640px,100%);max-height:88vh;overflow:auto;box-shadow:0 12px 48px #0002}.dmb progress{width:100%;accent-color:var(--accent);height:8px}.dmb .titlebar{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.dmb .stack{display:flex;gap:8px;flex-wrap:wrap}.dmb .time{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}.dmb details{margin:10px 0}.dmb summary{cursor:pointer}.dmb .source{border-top:1px solid var(--border);padding-top:10px;margin-top:10px}.dmb .small-label{font-size:12px;color:var(--muted)}
@media(max-width:700px){.dmb{padding:0}.dmb .brand{padding:12px}.dmb .sheet{padding:16px;border-radius:8px}.dmb .numbers{grid-template-columns:1fr 1fr;gap:12px}.dmb .split{grid-template-columns:1fr}.dmb .nav{gap:18px}.dmb .row{flex-wrap:wrap}.dmb .row .actions{width:100%;justify-content:flex-start}.dmb button{min-height:42px}.dmb .bar input{width:100%}.dmb .dialog{padding:10px}.dmb .titlebar{flex-wrap:wrap}}
`;
function BridgeManager({ call }) {
  const [tab, setTab] = (0, import_react.useState)(0), [stats, setStats] = (0, import_react.useState)(null), [error, setError] = (0, import_react.useState)(""), [notice, setNotice] = (0, import_react.useState)("");
  const [items, setItems] = (0, import_react.useState)([]), [imports, setImports] = (0, import_react.useState)([]), [history, setHistory] = (0, import_react.useState)([]), [conflicts, setConflicts] = (0, import_react.useState)([]), [backups, setBackups] = (0, import_react.useState)([]), [actions, setActions] = (0, import_react.useState)([]);
  const [query, setQuery] = (0, import_react.useState)(""), [status, setStatus] = (0, import_react.useState)("candidate"), [category, setCategory] = (0, import_react.useState)(""), [offset, setOffset] = (0, import_react.useState)(0), [busy, setBusy] = (0, import_react.useState)(false), [upload, setUpload] = (0, import_react.useState)("");
  const [selected, setSelected] = (0, import_react.useState)(null), [conversation, setConversation] = (0, import_react.useState)(null), [revisions, setRevisions] = (0, import_react.useState)([]), [checked, setChecked] = (0, import_react.useState)([]);
  const [confirmation, setConfirmation] = (0, import_react.useState)(null), [acknowledged, setAcknowledged] = (0, import_react.useState)(false), [mergeText, setMergeText] = (0, import_react.useState)("");
  const [autoRecall, setAutoRecall] = (0, import_react.useState)(false), [budget, setBudget] = (0, import_react.useState)(800), [limit, setLimit] = (0, import_react.useState)(6), [keep, setKeep] = (0, import_react.useState)(10);
  const [endpoint, setEndpoint] = (0, import_react.useState)("http://127.0.0.1:11434/v1/"), [model, setModel] = (0, import_react.useState)(""), [keyEnv, setKeyEnv] = (0, import_react.useState)(""), [remoteConsent, setRemoteConsent] = (0, import_react.useState)(false);
  const [storagePath, setStoragePath] = (0, import_react.useState)("D:\\DeepSeekMemoryBridge"), [folderBrowser, setFolderBrowser] = (0, import_react.useState)(null);
  const refresh = (0, import_react.useCallback)(async () => {
    const [s, a] = await Promise.all([call("stats"), call("actions")]);
    setStats(s);
    setActions(a);
    if (tab === 0) setImports(await call("imports"));
    if (tab === 1) setItems(query ? await call("search", { query, limit: 50 }) : await call("memories", { status, category, offset, limit: 50 }));
    if (tab === 2) setHistory(await call("history", { query, offset, limit: 50 }));
    if (tab === 3) setConflicts(await call("conflicts"));
    if (tab === 4) setBackups(await call("backups"));
  }, [call, tab, query, status, category, offset]);
  (0, import_react.useEffect)(() => {
    void refresh().catch((e) => setError(e.message));
  }, [refresh]);
  (0, import_react.useEffect)(() => {
    const timer = setInterval(() => {
      void call("stats").then(setStats).catch(() => {
      });
    }, 2e3);
    return () => clearInterval(timer);
  }, [call]);
  (0, import_react.useEffect)(() => {
    if (!stats) return;
    setAutoRecall(stats.settings.autoRecall);
    setBudget(stats.settings.recallBudgetTokens);
    setLimit(stats.settings.recallLimit);
    setKeep(stats.settings.backupKeep);
  }, [stats?.settings?.autoRecall, stats?.settings?.recallBudgetTokens, stats?.settings?.recallLimit, stats?.settings?.backupKeep]);
  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "\u64CD\u4F5C\u5931\u8D25");
    } finally {
      setBusy(false);
    }
  };
  const propose = async (type, payload, description) => {
    const p = await call("propose", { type, payload, description });
    const all = await call("actions");
    setActions(all);
    setConfirmation(all.find((a) => a.id === p.actionId));
    setAcknowledged(false);
  };
  const openConversation = (id, version, page = 0) => run(async () => {
    setConversation(await call("conversation", { id, version, offset: page, limit: 50 }));
  });
  const uploadFile = async (file) => run(async () => {
    const start = await call("upload-start", { name: file.name, bytes: file.size });
    for (let n = 0; n < file.size; n += 65536) {
      const chunk = new Uint8Array(await file.slice(n, n + 65536).arrayBuffer());
      let binary = "";
      for (const b of chunk) binary += String.fromCharCode(b);
      await call("upload-chunk", { id: start.id, offset: n, data: btoa(binary) });
      setUpload(`\u4E0A\u4F20 ${Math.min(n + chunk.length, file.size)} / ${file.size} \u5B57\u8282`);
    }
    setUpload("\u6B63\u5728\u672C\u5730\u89E3\u6790\u548C\u68C0\u67E5\u91CD\u590D");
    const preview = await call("upload-finish", { id: start.id });
    setUpload("");
    setNotice(`\u9884\u89C8\u5B8C\u6210\uFF1A${preview.parseable} \u4E2A\u53EF\u89E3\u6790\u4F1A\u8BDD\u3002\u6838\u5BF9\u4E0B\u65B9\u7EDF\u8BA1\u540E\u786E\u8BA4\u5BFC\u5165\u3002`);
    await refresh();
  });
  const review = (m, value) => run(() => propose("review", { id: m.id, status: value, revision: m.revision }, `\u5C06\u8BB0\u5FC6\u8BBE\u4E3A${statuses[value]}\uFF1A${m.content}`));
  const downloadRaw = () => run(async () => {
    const raw = await call("raw-conversation", { id: conversation.id, version: conversation.version });
    const blob = new Blob([JSON.stringify(raw, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url;
    a.download = "conversation.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  });
  const switchTab = (i) => {
    setTab(i);
    setQuery("");
    setOffset(0);
    setSelected(null);
    setConversation(null);
    setChecked([]);
  };
  const browse = async (path) => {
    setFolderBrowser(await call("storage-browse", { path }));
  };
  const chooseFolder = () => run(async () => {
    const picked = await call("storage-pick");
    if (picked.path) setStoragePath(picked.path);
    else await browse();
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dmb", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: css }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "brand", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "mark", viewBox: "0 0 36 30", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 24V9h9v15M25 24V9h9v15M10 13c5-10 11-10 16 0M7 24h22", fill: "none", stroke: "currentColor", strokeWidth: "2" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DeepSeek Memory Bridge" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "\u672C\u5730\u5386\u53F2\u4E0E\u957F\u671F\u8BB0\u5FC6 \xB7 0.2.2" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "sheet", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "titlebar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tabs[tab] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u539F\u6587\u7559\u5B58\u3001\u8BC1\u636E\u5BA1\u6838\u3001\u6309\u9700\u53EC\u56DE\u3002\u6570\u636E\u4FDD\u5B58\u5728\u8FD9\u53F0\u7535\u8111\u3002" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "manual-link", href: "https://github.com/baimengyan242-dot/BAI/blob/main/deepseek-memory-bridge/docs/USER_GUIDE.zh-CN.md", target: "_blank", rel: "noreferrer", children: "\u4F7F\u7528\u8BF4\u660E" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(refresh), disabled: busy, children: "\u5237\u65B0" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { className: "nav", "aria-label": "\u8BB0\u5FC6\u7BA1\u7406\u5BFC\u822A", role: "tablist", children: tabs.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { role: "tab", "aria-selected": tab === i, onClick: () => switchTab(i), children: [
        t,
        i === 3 && stats?.conflicts ? ` (${stats.conflicts})` : ""
      ] }, t)) }),
      error && !confirmation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "notice error", role: "alert", children: [
        error,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "link", onClick: () => setError(""), children: "\u5173\u95ED" })
      ] }),
      notice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "notice", role: "status", children: [
        notice,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "link", onClick: () => setNotice(""), children: "\u6536\u8D77" })
      ] }),
      !stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "empty", children: "\u6B63\u5728\u8BFB\u53D6\u672C\u5730\u8BB0\u5FC6\u5E93\u2026" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "numbers", children: [[stats.conversations, "\u539F\u59CB\u4F1A\u8BDD"], [stats.messages, "\u5F53\u524D\u7248\u672C\u6D88\u606F"], [stats.candidates, "\u5F85\u5BA1\u6838\u8BB0\u5FC6"], [stats.confirmed, "\u5DF2\u786E\u8BA4\u8BB0\u5FC6"]].map(([v, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: v })
      ] }, label)) }),
      stats?.progress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "notice", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          stats.progress.phase,
          " \xB7 ",
          stats.progress.completed,
          stats.progress.total ? ` / ${stats.progress.total}` : ""
        ] }),
        stats.busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("progress", { value: stats.progress.completed, max: stats.progress.total || void 0 })
      ] }),
      actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "notice", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [
          "\u5F85\u786E\u8BA4\u64CD\u4F5C\uFF08",
          actions.length,
          "\uFF09"
        ] }),
        actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "body", children: [
            a.description,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "muted", children: a.created_at })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: busy, onClick: () => {
            setConfirmation(a);
            setAcknowledged(false);
          }, children: "\u6838\u5BF9\u64CD\u4F5C" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(async () => {
            await call("cancel", { id: a.id });
            await refresh();
          }), children: "\u53D6\u6D88" })
        ] }, a.id))
      ] }),
      tab === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "steps", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "step", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "1. \u9884\u89C8\u6587\u4EF6" }),
            "\u68C0\u67E5\u683C\u5F0F\u3001\u91CD\u590D\u548C\u5F02\u5E38"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "step", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "2. \u786E\u8BA4\u5BFC\u5165" }),
            "\u539F\u6587\u5B58\u6863\u3001\u672C\u5730\u63D0\u53D6\u5019\u9009"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "step", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "3. \u5BA1\u6838\u8BB0\u5FC6" }),
            "\u786E\u8BA4\u540E\u624D\u5141\u8BB8\u8DE8\u4F1A\u8BDD\u53EC\u56DE"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "file", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "dmb-upload", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u9009\u62E9 DeepSeek \u624B\u52A8\u5BFC\u51FA\u7684 ZIP \u6216 JSON \u6587\u4EF6" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { id: "dmb-upload", type: "file", accept: ".zip,.json", disabled: busy, onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) void uploadFile(f);
            e.target.value = "";
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u9ED8\u8BA4\u538B\u7F29\u5305\u4E0A\u9650 512 MiB\uFF0C\u89E3\u538B\u603B\u91CF\u4E0A\u9650 1 GiB\u3002\u4EC5\u4E0A\u4F20\u5230\u5F53\u524D DSH \u4E3B\u673A\uFF1B\u672C\u673A\u4F7F\u7528\u65F6\u6570\u636E\u7559\u5728\u672C\u673A\u3002\u771F\u5B9E\u5B98\u65B9\u5BFC\u51FA\u6837\u672C\u7684\u9002\u914D\u4ECD\u5F85\u9A8C\u8BC1\u3002" }),
          upload && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: upload })
        ] }),
        !imports.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "empty", children: "\u8FD8\u6CA1\u6709\u5BFC\u5165\u4EFB\u52A1\u3002\u5148\u5728 DeepSeek \u7F51\u9875\u7AEF\u624B\u52A8\u5BFC\u51FA\u5386\u53F2\u6570\u636E\uFF0C\u518D\u9009\u62E9\u672C\u5730\u6587\u4EF6\u3002" }),
        imports.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "panel", style: { marginTop: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "titlebar", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: p.fileName }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pill", children: { preview: "\u7B49\u5F85\u786E\u8BA4", completed: "\u5DF2\u5BFC\u5165", importing: "\u53EF\u7EE7\u7EED\u5BFC\u5165", failed: "\u89E3\u6790\u5931\u8D25", preparing: "\u9884\u89C8\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u6587\u4EF6" }[p.status] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "\u603B\u4F1A\u8BDD\u6570 / \u53EF\u89E3\u6790\u4F1A\u8BDD" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
              p.conversations,
              " / ",
              p.parseable
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "\u6D88\u606F\u6570" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: p.messages }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "\u91CD\u590D\u4F1A\u8BDD / \u5DF2\u5B58\u5728\u4F1A\u8BDD\u7684\u65B0\u7248\u672C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
              p.duplicates,
              " / ",
              p.updated
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "\u5F02\u5E38\u53CA\u8B66\u544A\u9879" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: p.anomalies }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "\u5DF2\u63D0\u4EA4\u4F1A\u8BDD" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: p.cursor })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "\u683C\u5F0F\u8BF4\u660E\u4E0E\u5F02\u5E38\u62A5\u544A" }),
            p.warnings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: w }, w)),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
              "SHA-256: ",
              p.hash
            ] })
          ] }),
          ["preview", "importing"].includes(p.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "primary", disabled: busy, onClick: () => void run(() => propose("import", { id: p.id }, `\u5BFC\u5165 ${p.fileName}\uFF1A${p.parseable} \u4E2A\u53EF\u89E3\u6790\u4F1A\u8BDD\u3001${p.messages} \u6761\u6D88\u606F\uFF0C\u5E76\u5728\u672C\u5730\u63D0\u53D6\u5019\u9009\u8BB0\u5FC6`)), children: p.status === "importing" ? "\u7EE7\u7EED\u5BFC\u5165" : "\u6838\u5BF9\u5E76\u5BFC\u5165" })
        ] }, p.id))
      ] }),
      tab === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bar", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { "aria-label": "\u641C\u7D22\u8BB0\u5FC6", placeholder: "\u641C\u7D22\u8BB0\u5FC6\u6216\u6765\u6E90\u4E3B\u9898", value: query, onChange: (e) => {
            setQuery(e.target.value);
            setOffset(0);
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { "aria-label": "\u8BB0\u5FC6\u72B6\u6001", value: status, onChange: (e) => {
            setStatus(e.target.value);
            setOffset(0);
          }, children: Object.entries(statuses).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: k, children: v }, k)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { "aria-label": "\u8BB0\u5FC6\u5206\u7C7B", value: category, onChange: (e) => {
            setCategory(e.target.value);
            setOffset(0);
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u5168\u90E8\u5206\u7C7B" }),
            Object.entries(categoryNames).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: k, children: v }, k))
          ] }),
          checked.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setMergeText(items.filter((m) => checked.includes(m.id)).map((m) => m.content).join("\n")), children: [
            "\u5408\u5E76\u6240\u9009\uFF08",
            checked.length,
            "\uFF09"
          ] })
        ] }),
        query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u641C\u7D22\u8DE8\u5206\u7C7B\u8FD4\u56DE\u5019\u9009\u3001\u5DF2\u786E\u8BA4\u53CA\u672A\u5230\u671F\u6761\u76EE\uFF1B\u7ED3\u679C\u4E2D\u7684\u72B6\u6001\u4EE5\u6BCF\u6761\u6807\u8BB0\u4E3A\u51C6\u3002" }),
        !items.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "empty", children: "\u5F53\u524D\u6CA1\u6709\u5339\u914D\u8BB0\u5FC6\u3002\u5BFC\u5165\u540E\u53EA\u63D0\u53D6\u660E\u786E\u7684\u957F\u671F\u9648\u8FF0\uFF0C\u672A\u547D\u4E2D\u7684\u5185\u5BB9\u4ECD\u53EF\u5728\u5386\u53F2\u8BB0\u5F55\u4E2D\u67E5\u627E\u3002" }),
        items.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", "aria-label": `\u9009\u62E9\u8BB0\u5FC6 ${m.id}`, checked: checked.includes(m.id), onChange: (e) => setChecked(e.target.checked ? [...checked, m.id] : checked.filter((id) => id !== m.id)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "body", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pill " + m.status, children: statuses[m.status] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "muted", children: [
                categoryNames[m.category],
                " \xB7 ",
                m.scope === "global" ? "\u5168\u5C40" : m.scope,
                " \xB7 ",
                m.evidence === "user-stated" ? "\u7528\u6237\u9648\u8FF0" : "\u5F85\u9A8C\u8BC1\u63A8\u65AD"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "content", children: m.content }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "time", children: [
              "\u6765\u6E90 ",
              m.sources.length,
              " \u5904 \xB7 ",
              m.sources[0]?.originalTime || "\u539F\u59CB\u65F6\u95F4\u672A\u77E5"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => {
              setSelected(m);
              setRevisions([]);
            }, children: "\u67E5\u770B\u8BC1\u636E / \u7F16\u8F91" }),
            m.status === "candidate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: busy, onClick: () => void review(m, "confirmed"), children: "\u786E\u8BA4\u8BB0\u5FC6" })
          ] })
        ] }, m.id)),
        !query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bar", style: { marginTop: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: offset === 0, onClick: () => setOffset(Math.max(0, offset - 50)), children: "\u4E0A\u4E00\u9875" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "muted", children: [
            "\u7B2C ",
            offset / 50 + 1,
            " \u9875"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: items.length < 50, onClick: () => setOffset(offset + 50), children: "\u4E0B\u4E00\u9875" })
        ] })
      ] }),
      tab === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bar", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "grow", "aria-label": "\u641C\u7D22\u539F\u59CB\u5BF9\u8BDD", placeholder: "\u6309\u6D88\u606F\u5173\u952E\u8BCD\u641C\u7D22\u5386\u53F2\u5BF9\u8BDD", value: query, onChange: (e) => {
          setQuery(e.target.value);
          setOffset(0);
        } }) }),
        !history.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "empty", children: "\u6CA1\u6709\u5339\u914D\u5BF9\u8BDD\u3002\u539F\u59CB\u6570\u636E\u4F1A\u5728\u786E\u8BA4\u5BFC\u5165\u540E\u663E\u793A\u3002" }),
        history.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "body", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: c.title }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "time", children: [
              c.original_time || "\u539F\u59CB\u65F6\u95F4\u672A\u77E5",
              c.message_count != null ? ` \xB7 ${c.message_count} \u6761\u6D88\u606F` : ""
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: c.source_id }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void openConversation(c.id), children: "\u67E5\u770B\u539F\u6587" })
        ] }, c.id)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bar", style: { marginTop: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: offset === 0, onClick: () => setOffset(Math.max(0, offset - 50)), children: "\u4E0A\u4E00\u9875" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "muted", children: [
            "\u7B2C ",
            offset / 50 + 1,
            " \u9875"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: history.length < 50, onClick: () => setOffset(offset + 50), children: "\u4E0B\u4E00\u9875" })
        ] })
      ] }),
      tab === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        !conflicts.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "empty", children: "\u6CA1\u6709\u5F85\u5904\u7406\u51B2\u7A81\u3002\u5BF9\u4E8E\u540C\u4E00\u4F5C\u7528\u57DF\u3001\u540C\u4E00\u5C5E\u6027\u7684\u65B0\u65E7\u503C\uFF0C\u63D2\u4EF6\u4F1A\u4FDD\u7559\u4E24\u6761\u5019\u9009\u5E76\u8981\u6C42\u4EBA\u5DE5\u9009\u62E9\u3002" }),
        conflicts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "panel", style: { marginBottom: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u540C\u4E00\u5C5E\u6027\u5B58\u5728\u4E0D\u540C\u503C" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "muted", children: [
            "\u5C5E\u6027\uFF1A",
            c.old.key,
            "\uFF1B\u4E0D\u6309\u65F6\u95F4\u81EA\u52A8\u8986\u76D6\u3002\u8BF7\u7ED3\u5408\u6765\u6E90\u5224\u65AD\u3002"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "split", children: [["old", c.old, "\u4FDD\u7559\u65E7\u7248\u672C"], ["new", c.new, "\u4FDD\u7559\u65B0\u7248\u672C"]].map(([key, value, label]) => {
            const m = value;
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "content", children: m.content }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "time", children: m.sources[0]?.originalTime || "\u65F6\u95F4\u672A\u77E5" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: m.sources[0]?.quote }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: busy, onClick: () => void run(() => propose("resolve", { id: c.id, keep: key }, `${label}\u5E76\u5C06\u53E6\u4E00\u6761\u6807\u4E3A\u5DF2\u66F4\u65B0`)), children: label })
            ] }, key);
          }) })
        ] }, c.id))
      ] }),
      tab === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "panel", style: { marginBottom: 24 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u5B58\u50A8\u4F4D\u7F6E" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "small-label", children: "\u5F53\u524D\u8BB0\u5FC6\u5E93" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: stats?.dataDir }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u53EF\u9009\u62E9 D \u76D8\u6216\u5176\u4ED6\u6570\u636E\u76D8\u3002\u8FC1\u79FB\u5305\u542B\u6570\u636E\u5E93\u3001\u539F\u59CB\u5B58\u6863\u3001\u5907\u4EFD\u3001\u5BFC\u51FA\u6587\u4EF6\u53CA\u672A\u5B8C\u6210\u7684\u5BFC\u5165\u548C\u4E0A\u4F20\u3002\u91CD\u542F DSH \u540E\u4ECD\u4F7F\u7528\u6240\u9009\u4F4D\u7F6E\u3002" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
            "\u76EE\u6807\u6587\u4EF6\u5939",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { "aria-label": "\u76EE\u6807\u6587\u4EF6\u5939", placeholder: "D:\\DeepSeekMemoryBridge", value: storagePath, onChange: (e) => setStoragePath(e.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: busy, onClick: () => void chooseFolder(), children: "\u9009\u62E9\u6587\u4EF6\u5939" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: busy, onClick: () => void run(() => browse()), children: "\u6D4F\u89C8\u78C1\u76D8" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "primary", disabled: busy || !storagePath.trim(), onClick: () => void run(() => propose("storage", { path: storagePath, mode: "migrate" }, `\u5C06\u5F53\u524D\u8BB0\u5FC6\u5E93\u4ECE ${stats?.dataDir} \u5B8C\u6574\u8FC1\u79FB\u5230 ${storagePath}\u3002\u76EE\u6807\u6587\u4EF6\u5939\u5FC5\u987B\u4E3A\u7A7A\u3002\u6570\u636E\u5E93\u548C\u6587\u4EF6\u6821\u9A8C\u6210\u529F\u3001\u5207\u6362\u4F4D\u7F6E\u540E\u624D\u4F1A\u5220\u9664\u65E7\u76EE\u5F55\u3002`)), children: "\u8FC1\u79FB\u5F53\u524D\u8BB0\u5FC6\u5E93" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: busy || !storagePath.trim(), onClick: () => void run(() => propose("storage", { path: storagePath, mode: "open" }, `\u6253\u5F00 ${storagePath} \u4E2D\u5DF2\u6709\u7684 Memory Bridge \u8BB0\u5FC6\u5E93\u3002\u5F53\u524D\u76EE\u5F55\u4FDD\u7559\uFF0C\u4E24\u4E2A\u8BB0\u5FC6\u5E93\u4E0D\u4F1A\u5408\u5E76\u3002`)), children: "\u6253\u5F00\u5DF2\u6709\u8BB0\u5FC6\u5E93" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u8BFB\u53D6\u5176\u4ED6\u76D8\u4E2D\u5DF2\u5BFC\u5165\u7684\u5185\u5BB9\u65F6\uFF0C\u8BF7\u9009\u62E9\u540C\u65F6\u5305\u542B memory.sqlite \u548C archives \u7684\u6587\u4EF6\u5939\u3002DeepSeek \u5BFC\u51FA\u7684 ZIP \u6216 JSON \u6587\u4EF6\u8BF7\u5728\u201C\u5BFC\u5165\u4E2D\u5FC3\u201D\u5BFC\u5165\u3002" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "notice", children: [
          "\u5F53\u524D\u63D0\u53D6\uFF1A\u672C\u5730\u89C4\u5219\u3002\u81EA\u52A8\u53EC\u56DE\uFF1A",
          stats?.settings.autoRecall ? "\u5F00\u542F" : "\u5173\u95ED",
          "\u3002\u5982\u5176\u4ED6\u8BB0\u5FC6\u63D2\u4EF6\u4E5F\u5728\u53EC\u56DE\uFF0C\u8BF7\u7559\u610F\u91CD\u590D\u4FE1\u606F\u3002"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "split", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u53EC\u56DE\u4E0E\u672C\u5730\u5B58\u50A8" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: autoRecall, onChange: (e) => setAutoRecall(e.target.checked) }),
              "\u81EA\u52A8\u53EC\u56DE\u5DF2\u786E\u8BA4\u3001\u76F8\u5173\u4E14\u672A\u8FC7\u671F\u7684\u7528\u6237\u9648\u8FF0"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
              "\u6BCF\u6B21\u53EC\u56DE Token \u4E0A\u9650\uFF08\u4FDD\u5B88\u4F30\u7B97\uFF09",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", min: "128", max: "8000", value: budget, onChange: (e) => setBudget(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
              "\u6700\u591A\u53EC\u56DE\u8BB0\u5FC6\u6761\u6570",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", min: "1", max: "20", value: limit, onChange: (e) => setLimit(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
              "\u81EA\u52A8\u4FDD\u7559\u5907\u4EFD\u6570",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", min: "1", max: "100", value: keep, onChange: (e) => setKeep(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "primary", onClick: () => void run(() => propose("settings", { autoRecall, recallBudgetTokens: budget, recallLimit: limit, backupKeep: keep }, "\u4FDD\u5B58\u53EC\u56DE\u4E0E\u5907\u4EFD\u8BBE\u7F6E")), children: "\u4FDD\u5B58\u8BBE\u7F6E" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "muted", children: [
              "\u6700\u8FD1\u5BFC\u5165\uFF1A",
              stats?.lastImport || "\u5C1A\u672A\u5BFC\u5165",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
              "\u5378\u8F7D\u63D2\u4EF6\u4FDD\u7559\u6570\u636E\u3002\u6570\u636E\u5E93\u3001\u539F\u59CB\u5B58\u6863\u548C\u5907\u4EFD\u5747\u4E3A\u660E\u6587\u3002"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u5907\u4EFD\u3001\u6062\u590D\u4E0E\u5BFC\u51FA" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => propose("backup", {}, "\u521B\u5EFA\u5305\u542B\u6570\u636E\u5E93\u53CA\u539F\u59CB\u6587\u4EF6\u7684\u672C\u5730\u5907\u4EFD")), children: "\u521B\u5EFA\u5907\u4EFD" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => propose("export", { format: "json" }, "\u5BFC\u51FA JSON \u8BB0\u5FC6\u5217\u8868")), children: "\u5BFC\u51FA JSON" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => propose("export", { format: "markdown" }, "\u5BFC\u51FA Markdown \u8BB0\u5FC6\u5217\u8868")), children: "\u5BFC\u51FA Markdown" })
            ] }),
            !backups.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "empty", children: "\u6682\u65E0\u5907\u4EFD\u3002\u5BFC\u5165\u524D\u540E\u4F1A\u81EA\u52A8\u521B\u5EFA\u5907\u4EFD\u3002" }),
            backups.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "body", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "time", children: b.createdAt }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "muted", children: backupReasons[b.reason] || b.reason })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => propose("restore", { backupId: b.id }, "\u6062\u590D\u5907\u4EFD\uFF0C\u66FF\u6362\u6D3B\u52A8\u8BB0\u5FC6\u5E93\u548C\u539F\u59CB\u5B58\u6863\uFF1B\u6062\u590D\u524D\u4F1A\u53E6\u5B58\u5F53\u524D\u72B6\u6001")), children: "\u6062\u590D" })
            ] }, b.id))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "notice", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "\u9690\u79C1\u3001\u63D0\u53D6\u548C\u68C0\u7D22\u8303\u56F4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u672C\u63D2\u4EF6\u4E0D\u4F1A\u8BFB\u53D6 Cookie\u3001DSH \u51ED\u636E\u6216\u6D4F\u89C8\u5668\u8D26\u53F7\u3002\u539F\u59CB\u5386\u53F2\u6309\u539F\u6837\u4FDD\u7559\uFF0C\u56E0\u6B64\u53EF\u80FD\u5305\u542B\u4F60\u66FE\u5728\u804A\u5929\u4E2D\u8F93\u5165\u7684\u654F\u611F\u5185\u5BB9\uFF1B\u957F\u671F\u8BB0\u5FC6\u4F1A\u62E6\u622A\u5E38\u89C1\u51ED\u636E\u3002\u5F53\u524D\u68C0\u7D22\u4F7F\u7528 SQLite FTS5 \u4E0E\u4E2D\u4FC4\u82F1\u5173\u952E\u8BCD\uFF0C\u4E0D\u4F9D\u8D56\u4ED8\u8D39 Embedding \u670D\u52A1\u3002" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u672C\u5730\u63D0\u53D6\u4EC5\u751F\u6210\u5019\u9009\uFF0C\u652F\u6301\u6709\u9650\u7684\u4E2D\u6587\u3001\u82F1\u8BED\u548C\u4FC4\u8BED\u9648\u8FF0\u89C4\u5219\uFF1B\u672A\u8BC6\u522B\u5185\u5BB9\u4ECD\u4FDD\u5B58\u5728\u5386\u53F2\u5E93\u3002\u53EF\u5728\u539F\u59CB\u4F1A\u8BDD\u8BE6\u60C5\u4E2D\u9009\u62E9\u672C\u5730\u6216\u8FDC\u7A0B\u517C\u5BB9\u6A21\u578B\u8FDB\u4E00\u6B65\u63D0\u53D6\u3002\u8FDC\u7A0B\u53D1\u9001\u9700\u8981\u5355\u72EC\u52FE\u9009\u6388\u6743\u5E76\u786E\u8BA4\u3002" })
        ] })
      ] })
    ] }),
    folderBrowser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": "\u9009\u62E9\u5B58\u50A8\u6587\u4EF6\u5939", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dialog-inner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "titlebar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u9009\u62E9\u5B58\u50A8\u6587\u4EF6\u5939" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setFolderBrowser(null), children: "\u5173\u95ED" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u9009\u62E9\u78C1\u76D8\u548C\u5DF2\u6709\u6587\u4EF6\u5939\uFF1B\u4E5F\u53EF\u5173\u95ED\u6B64\u7A97\u53E3\uFF0C\u5728\u201C\u76EE\u6807\u6587\u4EF6\u5939\u201D\u4E2D\u8F93\u5165\u65B0\u7684\u4E13\u7528\u76EE\u5F55\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: folderBrowser.path || "\u53EF\u7528\u78C1\u76D8" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => browse()), children: "\u8FD4\u56DE\u78C1\u76D8\u5217\u8868" }),
        folderBrowser.parent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => browse(folderBrowser.parent)), children: "\u4E0A\u4E00\u7EA7" }),
        folderBrowser.path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "primary", onClick: () => {
          setStoragePath(folderBrowser.path);
          setFolderBrowser(null);
        }, children: "\u4F7F\u7528\u6B64\u6587\u4EF6\u5939" })
      ] }),
      folderBrowser.directories.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "row", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "link", onClick: () => void run(() => browse(path)), children: path }) }, path)),
      folderBrowser.truncated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u4EC5\u663E\u793A\u524D 300 \u4E2A\u6587\u4EF6\u5939\u3002\u5176\u4ED6\u6587\u4EF6\u5939\u53EF\u76F4\u63A5\u8F93\u5165\u5B8C\u6574\u8DEF\u5F84\u3002" })
    ] }) }),
    selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": "\u8BB0\u5FC6\u8BC1\u636E\u4E0E\u7F16\u8F91", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dialog-inner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "titlebar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u8BB0\u5FC6\u8BC1\u636E\u4E0E\u7F16\u8F91" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setSelected(null), children: "\u5173\u95ED" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "muted", children: [
        selected.id,
        " \xB7 \u4FEE\u8BA2 ",
        selected.revision
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        "\u8BB0\u5FC6\u5185\u5BB9",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: selected.content, onChange: (e) => setSelected({ ...selected, content: e.target.value }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "split", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
          "\u5206\u7C7B",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: selected.category, onChange: (e) => setSelected({ ...selected, category: e.target.value }), children: Object.entries(categoryNames).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: k, children: v }, k)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
          "\u4F5C\u7528\u57DF",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: selected.scope, onChange: (e) => setSelected({ ...selected, scope: e.target.value }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => propose("update", { id: selected.id, content: selected.content, category: selected.category, scope: selected.scope, revision: selected.revision }, "\u4FDD\u5B58\u7F16\u8F91\u5E76\u91CD\u65B0\u8FDB\u5165\u5019\u9009\u5BA1\u6838")), children: "\u4FDD\u5B58\u7F16\u8F91" }),
        selected.status === "candidate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void review(selected, "confirmed"), children: "\u786E\u8BA4\u8BB0\u5FC6" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void review(selected, "rejected"), children: "\u62D2\u7EDD\u5019\u9009" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "danger", onClick: () => void run(() => propose("delete", { id: selected.id, revision: selected.revision }, "\u5220\u9664\u8BB0\u5FC6\u5E76\u505C\u6B62\u53EC\u56DE\uFF0C\u4FDD\u7559\u5386\u53F2\u4FEE\u8BA2\u548C\u539F\u6587")), children: "\u5220\u9664" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "danger", onClick: () => void run(() => propose("purge", { id: selected.id }, "\u6C38\u4E45\u79FB\u9664\u6D3B\u52A8\u6570\u636E\u5E93\u4E2D\u7684\u8FD9\u6761\u8BB0\u5FC6\u53CA\u4FEE\u8BA2\u3002\u539F\u59CB\u804A\u5929\u548C\u5907\u4EFD\u4FDD\u7559\u3002")), children: "\u6C38\u4E45\u79FB\u9664\u8BB0\u5FC6" })
      ] }),
      selected.sources.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "source", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "time", children: [
          "\u7528\u6237\u539F\u59CB\u9648\u8FF0 \xB7 ",
          s.originalTime || "\u65F6\u95F4\u672A\u77E5"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: s.quote }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: s.messageId }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "link", onClick: () => {
          setSelected(null);
          void openConversation(s.conversationId, s.version);
        }, children: "\u5B9A\u4F4D\u539F\u59CB\u4F1A\u8BDD" }) })
      ] }, i)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "link", onClick: () => void run(async () => setRevisions(await call("revisions", { id: selected.id }))), children: "\u67E5\u770B\u4FEE\u8BA2\u5386\u53F2" }),
      revisions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "source", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "time", children: [
          "\u4FEE\u8BA2 ",
          r.revision,
          " \xB7 ",
          r.time,
          " \xB7 ",
          r.reason
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "content", children: r.snapshot.content }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => propose("rollback", { id: selected.id, targetRevision: r.revision, revision: selected.revision }, `\u56DE\u6EDA\u5230\u4FEE\u8BA2 ${r.revision}\uFF0C\u5E76\u91CD\u65B0\u8FDB\u5165\u5BA1\u6838`)), children: "\u56DE\u6EDA\u81F3\u6B64\u4FEE\u8BA2" })
      ] }, r.revision))
    ] }) }),
    conversation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": "\u539F\u59CB\u4F1A\u8BDD", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dialog-inner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "titlebar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: conversation.title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setConversation(null), children: "\u5173\u95ED" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u6B64\u5904\u7684\u5386\u53F2\u5185\u5BB9\u5747\u4E3A\u4E0D\u53EF\u4FE1\u6570\u636E\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u6267\u884C\u3002\u5206\u9875\u6BCF\u6B21 50 \u6761\u6D88\u606F\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        "\u4F1A\u8BDD\u7248\u672C",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: conversation.version, onChange: (e) => void openConversation(conversation.id, e.target.value), children: conversation.versions.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: v.content_hash, children: [
          v.content_hash.slice(0, 16),
          " \xB7 ",
          v.adapter
        ] }, v.content_hash)) })
      ] }),
      conversation.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "source", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pill", children: roleNames[m.role] || m.role }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "time", children: m.original_time || "\u65F6\u95F4\u672A\u77E5" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "content", children: m.text }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "\u6D88\u606F ID \u4E0E\u539F\u59CB\u5B57\u6BB5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: m.raw_json })
        ] })
      ] }, m.id)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void openConversation(conversation.id, conversation.version, Math.max(0, (conversation.messages[0]?.position ?? 0) - 50)), disabled: (conversation.messages[0]?.position ?? 0) === 0, children: "\u4E0A\u4E00\u9875\u6D88\u606F" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void openConversation(conversation.id, conversation.version, (conversation.messages.at(-1)?.position ?? 0) + 1), disabled: conversation.messages.length < 50, children: "\u4E0B\u4E00\u9875\u6D88\u606F" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void downloadRaw(), children: "\u4E0B\u8F7D\u4F1A\u8BDD\u539F\u59CB\u5B57\u6BB5" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "\u53EF\u9009\u6A21\u578B\u63D0\u53D6" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u5C06\u8BE5\u4F1A\u8BDD\u4E2D\u4E0D\u542B\u5E38\u89C1\u51ED\u636E\u7684\u7528\u6237\u6D88\u606F\u53D1\u9001\u7ED9\u4F60\u9009\u62E9\u7684\u6A21\u578B\uFF0CAI \u56DE\u590D\u4E0D\u4F1A\u4F5C\u4E3A\u7528\u6237\u4E8B\u5B9E\u3002\u6240\u6709\u7ED3\u679C\u4ECD\u9700\u5BA1\u6838\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
          "\u517C\u5BB9 API \u57FA\u5730\u5740",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: endpoint, onChange: (e) => {
            setEndpoint(e.target.value);
            setRemoteConsent(false);
          } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
          "\u6A21\u578B\u540D\u79F0",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: model, onChange: (e) => setModel(e.target.value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
          "API Key \u73AF\u5883\u53D8\u91CF\u540D\u79F0\uFF08\u4E0D\u586B\u5165\u5BC6\u94A5\u672C\u8EAB\uFF09",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: keyEnv, onChange: (e) => setKeyEnv(e.target.value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: remoteConsent, onChange: (e) => setRemoteConsent(e.target.checked) }),
          "\u82E5\u8BE5\u5730\u5740\u662F\u8FDC\u7A0B\u670D\u52A1\uFF0C\u6211\u6388\u6743\u672C\u6B21\u53D1\u9001\u8BE5\u4F1A\u8BDD\u7684\u7528\u6237\u6D88\u606F"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(() => propose("model-extract", { id: conversation.id, endpoint, model, keyEnv, authorizeRemote: remoteConsent }, `\u4F7F\u7528 ${model} \u4ECE\u6B64\u4F1A\u8BDD\u63D0\u53D6\u8BB0\u5FC6\uFF1B\u76EE\u6807\u5730\u5740 ${endpoint}\uFF0C\u8FDC\u7A0B\u53D1\u9001\u6388\u6743\uFF1A${remoteConsent ? "\u662F" : "\u5426"}`)), children: "\u6838\u5BF9\u6A21\u578B\u63D0\u53D6\u8BF7\u6C42" })
      ] })
    ] }) }),
    mergeText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": "\u5408\u5E76\u8BB0\u5FC6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dialog-inner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u5408\u5E76\u76F8\u5173\u8BB0\u5FC6" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "muted", children: "\u4FDD\u7559\u6BCF\u6761\u6765\u6E90\uFF0C\u539F\u8BB0\u5FC6\u6807\u4E3A\u5DF2\u66F4\u65B0\uFF1B\u5408\u5E76\u7ED3\u679C\u9700\u91CD\u65B0\u5BA1\u6838\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { "aria-label": "\u5408\u5E76\u540E\u7684\u8BB0\u5FC6\u5185\u5BB9", value: mergeText, onChange: (e) => setMergeText(e.target.value) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => void run(async () => {
          await propose("merge", { ids: checked, content: mergeText }, "\u5408\u5E76\u6240\u9009\u8BB0\u5FC6\u5E76\u4FDD\u7559\u5168\u90E8\u6765\u6E90");
          setMergeText("");
        }), children: "\u6838\u5BF9\u5408\u5E76" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setMergeText(""), children: "\u53D6\u6D88" })
      ] })
    ] }) }),
    confirmation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": "\u786E\u8BA4\u64CD\u4F5C", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dialog-inner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u786E\u8BA4\u64CD\u4F5C" }),
      error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "notice error", role: "alert", children: error }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: confirmation.description }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { open: true, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "\u5B8C\u6574\u64CD\u4F5C\u53C2\u6570" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: JSON.stringify(confirmation.payload, null, 2) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: acknowledged, onChange: (e) => setAcknowledged(e.target.checked) }),
        "\u6211\u5DF2\u6838\u5BF9\u4E0A\u8FF0\u6587\u4EF6\u3001\u8BB0\u5FC6\u548C\u64CD\u4F5C\u8303\u56F4\uFF0C\u786E\u8BA4\u6267\u884C"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "stack", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "primary", disabled: !acknowledged || busy, onClick: () => void run(async () => {
          const result = await call("confirm", { id: confirmation.id, nonce: confirmation.nonce });
          setConfirmation(null);
          setSelected(null);
          setNotice(result?.dataDir ? `\u5F53\u524D\u8BB0\u5FC6\u5E93\uFF1A${result.dataDir}\u3002${result.warning || (result.sourceRemoved ? "\u65E7\u6570\u636E\u76EE\u5F55\u5DF2\u5220\u9664\u3002" : "\u539F\u8BB0\u5FC6\u5E93\u76EE\u5F55\u5DF2\u4FDD\u7559\u3002")}` : typeof result?.path === "string" ? `\u64CD\u4F5C\u5B8C\u6210\uFF0C\u6587\u4EF6\u4F4D\u7F6E\uFF1A${result.path}` : "\u64CD\u4F5C\u5B8C\u6210\u3002");
          setChecked([]);
          await refresh();
        }), children: busy ? "\u5904\u7406\u4E2D\u2026" : "\u786E\u8BA4\u6267\u884C" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: busy, onClick: () => setConfirmation(null), children: "\u8FD4\u56DE\u6838\u5BF9" })
      ] })
    ] }) })
  ] });
}
var inject = ["slots", "connection"];
function apply(ctx) {
  const connection = ctx.get("connection");
  const call = async (endpoint, payload = {}) => {
    const result = await connection.rpc.call("/api", "deepseek-memory-bridge", { endpoint, input: payload });
    if (!result.ok) throw new Error(result.error.message);
    return result.value;
  };
  ctx.slots.inject("settings.section", () => ctx.slots.register({ name: "settings.section", id: "deepseek-memory-bridge", order: 46, label: () => "DeepSeek \u8BB0\u5FC6\u6865", inject: () => ({ call }) }, BridgeManager));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
