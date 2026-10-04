/* ============================================================
   Bhabajit Kashyap — Interactive Engineering Console & Core Logic
   100% Vanilla JS, zero dependencies, responsive & accessible
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCopyEmail();
  initSystemsConsole();
});

/* ------------------------------------------------------------
   1. Theme Management (System-aware + LocalStorage persistence)
   ------------------------------------------------------------ */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const next = active === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ------------------------------------------------------------
   2. Copy Email with Toast Feedback
   ------------------------------------------------------------ */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('copy-toast');
  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', async () => {
    const email = 'bhabajitkashyapik@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Email copied: ' + email);
    } catch (err) {
      showToast('Contact: ' + email);
    }
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

/* ------------------------------------------------------------
   3. Interactive Live Systems Telemetry Console
   ------------------------------------------------------------ */
function initSystemsConsole() {
  // Tab Switching
  const tabBtns = document.querySelectorAll('.console-tab-btn');
  const arenas = {
    raft: document.getElementById('arena-raft'),
    lob: document.getElementById('arena-lob'),
    mcp: document.getElementById('arena-mcp')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;

      Object.keys(arenas).forEach(k => {
        if (arenas[k]) arenas[k].style.display = (k === tab) ? 'flex' : 'none';
      });
    });
  });

  // Raft Consensus Engine Simulation State
  let raftState = {
    term: 14,
    leaderId: 1,
    commitIndex: 1042,
    partitioned: false,
    nodes: [
      { id: 1, role: 'Leader', term: 14, status: 'ok' },
      { id: 2, role: 'Follower', term: 14, status: 'ok' },
      { id: 3, role: 'Follower', term: 14, status: 'ok' },
      { id: 4, role: 'Follower', term: 14, status: 'ok' },
      { id: 5, role: 'Follower', term: 14, status: 'ok' }
    ]
  };

  const termEl = document.getElementById('val-raft-term');
  const commitEl = document.getElementById('val-raft-commit');
  const quorumEl = document.getElementById('val-raft-quorum');
  const logStream = document.getElementById('raft-log-stream');
  const nodeEls = document.querySelectorAll('.raft-node');

  function renderRaftUI() {
    if (termEl) termEl.textContent = raftState.term;
    if (commitEl) commitEl.textContent = raftState.commitIndex;
    if (quorumEl) quorumEl.textContent = raftState.partitioned ? '3/5 (Quorum Met)' : '5/5 (Full Quorum)';

    nodeEls.forEach(el => {
      const nid = parseInt(el.dataset.nodeId, 10);
      const isLeader = nid === raftState.leaderId;
      const isPartitioned = raftState.partitioned && (nid === 4 || nid === 5);

      el.classList.toggle('is-leader', isLeader);
      el.classList.toggle('is-partitioned', isPartitioned);

      const roleEl = el.querySelector('.raft-node-role');
      if (roleEl) {
        if (isLeader) roleEl.textContent = 'Leader';
        else if (isPartitioned) roleEl.textContent = 'Partitioned';
        else roleEl.textContent = 'Follower';
      }
    });
  }

  function addRaftLog(msg, type = 'ok') {
    if (!logStream) return;
    const now = new Date();
    const ts = now.toISOString().slice(11, 19) + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const line = document.createElement('div');
    line.className = 'raft-log-line';
    line.innerHTML = `<span class="ts">[${ts}]</span> <span class="${type}">${msg}</span>`;
    logStream.appendChild(line);
    logStream.scrollTop = logStream.scrollHeight;
  }

  // Raft Control Buttons
  const btnHeartbeat = document.getElementById('btn-raft-heartbeat');
  const btnPartition = document.getElementById('btn-raft-partition');
  const btnElection = document.getElementById('btn-raft-election');

  if (btnHeartbeat) {
    btnHeartbeat.addEventListener('click', () => {
      raftState.commitIndex += 1;
      addRaftLog(`AppendEntries RPC: N${raftState.leaderId} -> quorum committed idx=${raftState.commitIndex}`, 'ok');
      renderRaftUI();
    });
  }

  if (btnPartition) {
    btnPartition.addEventListener('click', () => {
      raftState.partitioned = !raftState.partitioned;
      if (raftState.partitioned) {
        addRaftLog('Network partition injected: isolating {N4, N5} from majority', 'warn');
      } else {
        addRaftLog('Partition healed: {N4, N5} synced up-to-date with Leader N' + raftState.leaderId, 'ok');
      }
      renderRaftUI();
    });
  }

  if (btnElection) {
    btnElection.addEventListener('click', () => {
      raftState.term += 1;
      // Elect next leader in majority {1, 2, 3}
      const candidates = [1, 2, 3].filter(id => id !== raftState.leaderId);
      raftState.leaderId = candidates[Math.floor(Math.random() * candidates.length)];
      addRaftLog(`Term ${raftState.term}: RequestVote RPC won by Node ${raftState.leaderId} (Quorum 3/5 achieved)`, 'leader');
      renderRaftUI();
    });
  }

  // Periodic heartbeat tick (simulating live telemetry)
  setInterval(() => {
    const latSpan = document.getElementById('live-latency-ticker');
    if (latSpan) {
      const lat = (1.2 + Math.random() * 0.7).toFixed(2);
      latSpan.textContent = `p99: ${lat} μs`;
    }
  }, 2200);

  // Initial render
  renderRaftUI();
  addRaftLog('Consensus Cluster initialized. Term 14 active, quorum healthy.', 'ok');
}
