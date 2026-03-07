/**
 * FILE MÔ PHỎNG: MAXTAB (FIXED EVENT LOOP)
 * Tác giả: Gemini 3 Flash
 */

window.maxtab_matrix = [];
window.maxtab_n = 0;
window.maxtab_s = [];
window.maxtab_dp = [];
window.maxtab_best = { sum: 0, r: -1, c: -1, k: 0 };
window.maxtab_generator = null; // Biến điều khiển chính cho mô phỏng

function init_hcm1213_maxtab_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng MAXTAB: Ba ma trận song song</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>N: <input type="number" id="maxtab-n" value="3" min="2" max="6" style="width:45px; padding:3px;"></div>
                <select id="maxtab-mode-select" onchange="maxtab_switch_layout()" style="padding:5px; border-radius:4px;">
                    <option value="vetcan">Cách 1: Vét cạn (Duyệt thủ công)</option>
                    <option value="dpsum">Cách 2: DP + Prefix Sum (Tối ưu)</option>
                </select>
                <button onclick="maxtab_generate()" class="toggle-btn" style="background:#64748b; color:white;">🎲 Random</button>
                <button onclick="maxtab_init_run()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="maxtab_step()" id="btn-maxtab-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div id="maxtab-workspace" style="display: flex; gap: 10px; justify-content: center; overflow-x: auto; padding-bottom: 10px;">
                <div class="matrix-col" style="flex: 1; min-width: 150px; background: white; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="font-size:0.75rem; font-weight:bold; text-align:center; margin-bottom:8px; color:#64748b;">MA TRẬN GỐC (A)</div>
                    <div id="grid-a" style="display: flex; justify-content: center;"></div>
                </div>
                
                <div id="col-s" class="matrix-col" style="flex: 1; min-width: 150px; background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #bbf7d0; display: none;">
                    <div style="font-size:0.75rem; font-weight:bold; text-align:center; margin-bottom:8px; color:#166534;">PREFIX SUM (S)</div>
                    <div id="grid-s" style="display: flex; justify-content: center;"></div>
                </div>

                <div id="col-dp" class="matrix-col" style="flex: 1; min-width: 150px; background: #eff6ff; padding: 10px; border-radius: 8px; border: 1px solid #bfdbfe; display: none;">
                    <div style="font-size:0.75rem; font-weight:bold; text-align:center; margin-bottom:8px; color:#1e40af;">CẠNH MAX (DP)</div>
                    <div id="grid-dp" style="display: flex; justify-content: center;"></div>
                </div>
            </div>

            <div id="maxtab-info" style="margin-top:15px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 15px;">
                <div id="maxtab-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 140px; overflow-y: auto; font-size: 0.8rem; line-height: 1.4;">
                    > Nhấn Random hoặc Bắt đầu.
                </div>
                <div style="background: #fffbeb; padding: 12px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#92400e;">TỔNG MAX HIỆN TẠI</div>
                    <div id="maxtab-res" style="color:#ef4444; font-size: 2.5rem; font-weight: 900;">0</div>
                    <div id="maxtab-vars" style="font-size:0.75rem; color:#b45309; font-family:monospace;">k=0, i=0, j=0</div>
                </div>
            </div>
        </div>
    `;
    maxtab_generate();
    maxtab_switch_layout();
}

function maxtab_switch_layout() {
    const mode = document.getElementById('maxtab-mode-select').value;
    document.getElementById('col-s').style.display = (mode === 'dpsum') ? 'block' : 'none';
    document.getElementById('col-dp').style.display = (mode === 'dpsum') ? 'block' : 'none';
}

function maxtab_generate() {
    const n = parseInt(document.getElementById('maxtab-n').value);
    window.maxtab_n = n;
    window.maxtab_matrix = Array.from({length: n}, () => Array.from({length: n}, () => Math.floor(Math.random() * 6)));
    if(n === 3) window.maxtab_matrix = [[1,1,0],[2,2,1],[2,1,5]];
    
    // Reset ma trận phụ tránh lỗi render
    window.maxtab_s = Array.from({length: n+1}, () => Array(n+1).fill(0));
    window.maxtab_dp = Array.from({length: n+1}, () => Array(n+1).fill(0));
    window.maxtab_generator = null;
    
    maxtab_refresh_views();
    document.getElementById('maxtab-log').innerHTML = `> Đã tạo ma trận ${n}x${n}.`;
    document.getElementById('btn-maxtab-step').disabled = true;
}

function maxtab_render_matrix(targetId, data, isSub, active = {}) {
    const size = isSub ? window.maxtab_n + 1 : window.maxtab_n;
    let html = `<table style="border-collapse: collapse; font-family: monospace;">`;
    for (let i = 0; i < size; i++) {
        html += `<tr>`;
        for (let j = 0; j < size; j++) {
            let val = (data && data[i]) ? data[i][j] : 0;
            let style = "width:30px; height:30px; text-align:center; border:1px solid #cbd5e1; font-size:0.8rem;";
            
            if (active.currI === i && active.currJ === j) {
                style += "background: #fde047; font-weight: bold; border: 2px solid #000;";
            }
            if (!isSub && active.k && i >= active.r && i < active.r + active.k && j >= active.c && j < active.c + active.k) {
                style += "background: #fef08a; border: 1.5px solid #f59e0b;";
            }
            if (!isSub && val === 0) style += "color:#cbd5e1;";

            html += `<td style="${style}">${val}</td>`;
        }
        html += `</tr>`;
    }
    document.getElementById(targetId).innerHTML = html + "</table>";
}

function maxtab_refresh_views(active = {}) {
    maxtab_render_matrix('grid-a', window.maxtab_matrix, false, active);
    const mode = document.getElementById('maxtab-mode-select').value;
    if (mode === 'dpsum') {
        maxtab_render_matrix('grid-s', window.maxtab_s, true, active);
        maxtab_render_matrix('grid-dp', window.maxtab_dp, true, active);
    }
}

function maxtab_init_run() {
    const mode = document.getElementById('maxtab-mode-select').value;
    const n = window.maxtab_n;
    window.maxtab_best = { sum: 0, r: -1, c: -1, k: 0 };
    document.getElementById('maxtab-res').innerText = "0";
    document.getElementById('maxtab-log').innerHTML = "";

    // Đảm bảo khởi tạo lại mảng phụ
    window.maxtab_s = Array.from({length: n + 1}, () => Array(n + 1).fill(0));
    window.maxtab_dp = Array.from({length: n + 1}, () => Array(n + 1).fill(0));
    
    if (mode === 'dpsum') {
        window.maxtab_generator = maxtab_logic_dpsum();
    } else {
        window.maxtab_generator = maxtab_logic_vetcan();
    }

    document.getElementById('btn-maxtab-step').disabled = false;
    maxtab_step(); // Chạy bước đầu tiên luôn
}

function* maxtab_logic_vetcan() {
    const n = window.maxtab_n;
    for (let k = 1; k <= n; k++) {
        for (let i = 0; i <= n - k; i++) {
            for (let j = 0; j <= n - k; j++) {
                document.getElementById('maxtab-vars').innerText = `k=${k}, i=${i+1}, j=${j+1}`;
                let hasZero = false;
                let sum = 0;
                for (let r = i; r < i + k; r++) {
                    for (let c = j; c < j + k; c++) {
                        if (window.maxtab_matrix[r][c] === 0) hasZero = true;
                        sum += window.maxtab_matrix[r][c];
                    }
                }
                maxtab_refresh_views({r: i, c: j, k: k});
                if (hasZero) maxtab_log(`K=${k} tại (${i+1},${j+1}): Có số 0.`, "#94a3b8");
                else {
                    if (sum > window.maxtab_best.sum) {
                        window.maxtab_best = {sum, r: i, c: j, k: k};
                        document.getElementById('maxtab-res').innerText = sum;
                        maxtab_log(`K=${k} tại (${i+1},${j+1}): Tổng=${sum} (MAX)`, "#10b981");
                    } else maxtab_log(`K=${k} tại (${i+1},${j+1}): Tổng=${sum}`);
                }
                yield;
            }
        }
    }
}

function* maxtab_logic_dpsum() {
    const n = window.maxtab_n;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            let val = window.maxtab_matrix[i-1][j-1];
            window.maxtab_s[i][j] = val + window.maxtab_s[i-1][j] + window.maxtab_s[i][j-1] - window.maxtab_s[i-1][j-1];
            
            if (val > 0) {
                window.maxtab_dp[i][j] = Math.min(window.maxtab_dp[i-1][j], window.maxtab_dp[i][j-1], window.maxtab_dp[i-1][j-1]) + 1;
                let k = window.maxtab_dp[i][j];
                let sum = window.maxtab_s[i][j] - window.maxtab_s[i-k][j] - window.maxtab_s[i][j-k] + window.maxtab_s[i-k][j-k];
                
                maxtab_refresh_views({currI: i, currJ: j, r: i-k, c: j-k, k: k});
                if (sum > window.maxtab_best.sum) {
                    window.maxtab_best = {sum, r: i-k, c: j-k, k: k};
                    document.getElementById('maxtab-res').innerText = sum;
                    maxtab_log(`(${i},${j}): k=${k}, Tổng=${sum} (MAX)`, "#10b981");
                } else maxtab_log(`(${i},${j}): k=${k}, Tổng=${sum}`);
            } else {
                window.maxtab_dp[i][j] = 0;
                maxtab_refresh_views({currI: i, currJ: j});
                maxtab_log(`(${i},${j}) là 0 -> DP=0`);
            }
            yield;
        }
    }
}

function maxtab_step() {
    if (!window.maxtab_generator) return;
    const result = window.maxtab_generator.next();
    if (result.done) {
        document.getElementById('btn-maxtab-step').disabled = true;
        maxtab_log("HOÀN THÀNH!", "#fbbf24");
    }
}

function maxtab_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('maxtab-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}