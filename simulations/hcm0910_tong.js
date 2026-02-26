/**
 * FILE MÔ PHỎNG: BÀI TỔNG (PHÂN TÍCH SỐ)
 * Tên hàm: init_hcm0910_tong_simulation
 */

window.tong_n = 0;
window.tong_sim = null;
window.tong_dpTable = [];

function init_hcm0910_tong_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng thuật toán</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div class="input-group">
                    <b>Nhập N:</b> 
                    <input type="number" id="input-tong-n" value="6" min="1" max="15" style="width: 60px; margin-left:10px;">
                </div>
                <select id="tong-method" class="toggle-btn" style="background:#f1f5f9; color:#334155; border: 1px solid #cbd5e1;">
                    <option value="dfs">Vét cạn (DFS)</option>
                    <option value="dp">Quy hoạch động (DP)</option>
                </select>
                <button onclick="tong_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Khởi tạo</button>
                <button onclick="tong_nextStep()" id="btn-step-tong" class="toggle-btn" style="background:#29c702; color:white;">⏭ Từng bước</button>
            </div>

            <div id="tong-visual-area" style="overflow-x: auto; min-height: 200px; background: white; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1;">
                <p style="text-align: center; color: #64748b;">Khởi tạo để bắt đầu mô phỏng</p>
            </div>

            <div id="tong-log-area" style="margin-top: 15px; background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: monospace; height: 150px; overflow-y: auto; font-size: 0.9rem;">
            </div>
            
            <div style="text-align: center; margin-top: 15px; font-weight: bold;">
                Kết quả: <span id="tong-res-val" style="color:#c70202; font-size: 1.3rem;">0</span>
            </div>
        </div>
    `;
}

function tong_log(msg, color = "#d4d4d4") {
    const logArea = document.getElementById('tong-log-area');
    if (logArea) {
        logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function tong_init() {
    window.tong_n = parseInt(document.getElementById('input-tong-n').value) || 0;
    const method = document.getElementById('tong-method').value;
    
    document.getElementById('tong-log-area').innerHTML = "";
    document.getElementById('tong-res-val').innerText = "0";
    document.getElementById('btn-step-tong').disabled = false;

    if (method === "dfs") {
        window.tong_sim = tong_dfsGen(window.tong_n);
        document.getElementById('tong-visual-area').innerHTML = "<p style='text-align:center'>Đang chạy DFS...</p>";
    } else {
        window.tong_sim = tong_dpGen(window.tong_n);
    }
}

function* tong_dfsGen(n) {
    let count = 0;
    let path = [];
    function* backtrack(x, currentSum) {
        if (currentSum === n) {
            count++;
            document.getElementById('tong-res-val').innerText = count;
            tong_log(`Tìm thấy: {${path.join(", ")}}`, "#10b981");
            yield; return;
        }
        if (currentSum > n || x > n) return;
        
        tong_log(`Thử chọn số ${x}`, "#38bdf8");
        path.push(x);
        yield* backtrack(x + 1, currentSum + x);
        
        path.pop();
        tong_log(`Bỏ qua số ${x}`, "#94a3b8");
        yield* backtrack(x + 1, currentSum);
    }
    yield* backtrack(1, 0);
    tong_log("HOÀN THÀNH", "#f59e0b");
}

function* tong_dpGen(n) {
    window.tong_dpTable = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    for(let j=0; j<=n; j++) window.tong_dpTable[0][j] = 1;
    
    tong_renderTable(n, -1, -1);
    tong_log("Cơ sở: dp[0][j] = 1 (tổng 0 luôn có 1 cách)", "#38bdf8");
    yield;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            window.tong_dpTable[i][j] = window.tong_dpTable[i][j-1];
            let sources = [[i, j-1]];
            if (i >= j) {
                window.tong_dpTable[i][j] += window.tong_dpTable[i-j][j-1];
                sources.push([i-j, j-1]);
            }
            tong_renderTable(n, i, j, sources);
            document.getElementById('tong-res-val').innerText = window.tong_dpTable[i][j];
            yield;
        }
    }
    tong_log("HOÀN THÀNH", "#f59e0b");
}

function tong_renderTable(n, activeI, activeJ, sources = []) {
    let html = `<table class="garden-table" style="font-size:0.8rem; margin:auto"><tr><td class="idx-row">i\\j</td>`;
    for(let j=0; j<=n; j++) html += `<td class="idx-row">${j}</td>`;
    html += `</tr>`;
    for (let i = 0; i <= n; i++) {
        html += `<tr><td class="idx-row">${i}</td>`;
        for (let j = 0; j <= n; j++) {
            let isTarget = (i === activeI && j === activeJ);
            let isSource = sources.some(s => s[0] === i && s[1] === j);
            let style = isTarget ? "background:#fef08a; border:2px solid #f59e0b" : (isSource ? "background:#e0f2fe" : "");
            html += `<td style="${style}">${window.tong_dpTable[i][j]}</td>`;
        }
        html += `</tr>`;
    }
    document.getElementById('tong-visual-area').innerHTML = html + `</table>`;
}

function tong_nextStep() {
    if (!window.tong_sim) return;
    if (window.tong_sim.next().done) {
        document.getElementById('btn-step-tong').disabled = true;
    }
}