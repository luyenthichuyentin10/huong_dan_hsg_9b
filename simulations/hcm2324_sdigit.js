/**
 * FILE MÔ PHỎNG: SỐ SDIGIT (HCM 23-24)
 * Cập nhật: Mô phỏng thuật toán C++ của GV (Lập bảng DP & mảng KQ)
 */

window.sd_l = 0;
window.sd_r = 0;
window.sd_MOD = 1000000007n;
window.sd_DP = []; // dp[len][sum]
window.sd_KQ = []; // kq[len]
window.sd_generator = null;
window.sd_auto_timer = null;

function init_hcm2324_sdigit_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: DP Digit & Kỹ thuật "Số 0 đứng đầu"</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập l và r:</label><br>
                    <textarea id="sd-input" style="width: 150px; height: 60px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="l r">1 2</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="sd_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp & Chạy Thuật Toán</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="sd_step()" id="btn-sd-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="sd_toggle_auto()" id="btn-sd-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top:5px;">
                        <div style="background: #e0f2fe; padding: 10px; border-radius: 8px; border: 1px solid #bae6fd; flex:1; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#0369a1;">MẢNG TIỀN XỬ LÝ (KQ)</div>
                            <div id="sd-kq-array" style="display:flex; justify-content:center; gap:5px; margin-top:8px;"></div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 2px solid #22c55e; width: 200px; text-align: center; display:flex; flex-direction:column; justify-content:center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534; margin-bottom: 5px;">TRUY VẤN (O(1))</div>
                            <div id="sd-res-query" style="color:#15803d; font-size: 1.5rem; font-weight: 900; font-family:monospace;">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x: auto; min-height: 250px;">
                    <div id="sd-visual-title" style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px;">BẢNG DP[Độ Dài][Tổng]</div>
                    <div id="sd-visual-container" style="display: flex; flex-direction: column; gap: 5px;"></div>
                </div>

                <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fde047; display:flex; flex-direction:column;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:5px;">DIỄN GIẢI THUẬT TOÁN (LOG)</div>
                    <div id="sd-log" style="font-family: monospace; font-size: 0.85rem; color: #475569; overflow-y: auto; flex:1; min-height: 200px; line-height: 1.6; background:white; padding:8px; border:1px solid #fde68a;"></div>
                </div>
            </div>
        </div>
    `;
}

function sd_log(msg, highlight = false) {
    const log = document.getElementById('sd-log');
    let fw = highlight ? "font-weight:bold; color:#b45309;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #fef08a; padding: 4px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function sd_start() {
    const lines = document.getElementById('sd-input').value.trim().split('\n');
    clearInterval(window.sd_auto_timer);
    document.getElementById('btn-sd-auto').innerHTML = "▶ Tự động";
    window.sd_auto_timer = null;

    try {
        const [l, r] = lines[0].trim().split(/\s+/).map(Number);
        window.sd_l = l;
        window.sd_r = r;
        if (l > r) throw new Error();
        
        if (r > 4) {
            alert("Để bảng DP có thể hiển thị vừa trên màn hình, mô phỏng trực quan chỉ hỗ trợ tối đa r = 4."); return;
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Vui lòng nhập l và r (l <= r)."); return;
    }

    document.getElementById('sd-res-query').innerText = "-";
    document.getElementById('sd-log').innerHTML = "";
    document.getElementById('sd-visual-container').innerHTML = "";
    document.getElementById('sd-kq-array').innerHTML = "";
    
    document.getElementById('btn-sd-step').disabled = false;
    document.getElementById('btn-sd-auto').disabled = false;
    
    window.sd_generator = logic_sd_dp_advanced();
    sd_log(`Đã nạp l = ${window.sd_l}, r = ${window.sd_r}. Bắt đầu Lập bảng...`, true);
}

function sd_render_dp_table(activeLen, activeSum, deps = []) {
    const container = document.getElementById('sd-visual-container');
    let maxSum = window.sd_r * 9;
    
    let html = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 0.85rem;">`;
    
    // Header Row (Sums)
    html += `<tr><th style="padding:4px; border:1px solid #cbd5e1; background:#f1f5f9; position:sticky; left:0; z-index:2;">L \\ Sum</th>`;
    for(let s=0; s<=maxSum; s++) {
        let isPrimeSum = isPrime(s);
        let color = isPrimeSum ? "color:#166534; background:#dcfce7;" : "color:#64748b;";
        html += `<th style="padding:4px; min-width:25px; border:1px solid #cbd5e1; ${color}">${s}</th>`;
    }
    html += `</tr>`;

    // DP Rows
    for(let i=0; i<window.sd_DP.length; i++) {
        html += `<tr>`;
        html += `<td style="padding:4px; font-weight:bold; border:1px solid #cbd5e1; background:#f1f5f9; position:sticky; left:0; z-index:1;">i=${i}</td>`;
        
        for(let s=0; s<=maxSum; s++) {
            let val = window.sd_DP[i][s];
            if (val === undefined) val = "";
            else if (val === 0n) val = '<span style="color:#cbd5e1;">0</span>';
            
            let bg = "white";
            let border = "1px solid #e2e8f0";
            
            if (i === activeLen && s === activeSum) {
                bg = "#fef08a"; border = "2px solid #f59e0b"; // Vàng (đang tính)
            } else if (deps.includes(s) && i === activeLen - 1) {
                bg = "#bae6fd"; border = "2px solid #0284c7"; // Xanh (nguồn)
            }
            
            html += `<td style="padding:4px; border:${border}; background:${bg}; transition:0.3s;">${val}</td>`;
        }
        html += `</tr>`;
    }
    html += `</table>`;
    container.innerHTML = html;
}

function sd_render_kq(activeIdx = -1) {
    const container = document.getElementById('sd-kq-array');
    let html = "";
    for(let i=0; i<=window.sd_r; i++) {
        let val = window.sd_KQ[i] !== undefined ? window.sd_KQ[i] : "-";
        let bg = i === activeIdx ? "#fef08a" : "white";
        let border = i === activeIdx ? "2px solid #f59e0b" : "1px solid #cbd5e1";
        let scale = i === activeIdx ? "transform:scale(1.1); font-weight:bold;" : "";
        
        html += `
            <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="font-size:0.7rem; color:#64748b; font-weight:bold;">KQ[${i}]</div>
                <div style="width:40px; height:30px; display:flex; align-items:center; justify-content:center; background:${bg}; border:${border}; border-radius:4px; font-family:monospace; font-size:0.9rem; transition:0.3s; ${scale}">${val}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function* logic_sd_dp_advanced() {
    let l = window.sd_l;
    let r = window.sd_r;
    let maxSum = r * 9;
    
    window.sd_DP = Array(r + 1).fill().map(() => Array(maxSum + 1).fill(0n));
    window.sd_KQ = Array(r + 1).fill(0n);
    
    // Khởi tạo
    window.sd_DP[0][0] = 1n; 
    sd_log(`Khởi tạo DP[0][0] = 1 (Chuỗi rỗng có tổng 0)`);
    sd_render_dp_table(0, 0);
    sd_render_kq(0);
    yield;

    for (let i = 1; i <= r; i++) {
        window.sd_DP[i][0] = 1n; // Chuỗi toàn số 0
        
        for (let s = 1; s <= i * 9; s++) {
            let bd = Math.max(0, s - 9);
            let deps = [];
            
            for (let j = s; j >= bd; j--) {
                deps.push(j);
                window.sd_DP[i][s] = (window.sd_DP[i][s] + window.sd_DP[i-1][j]) % window.sd_MOD;
            }
            
            if (window.sd_DP[i][s] > 0n) {
                sd_render_dp_table(i, s, deps);
                sd_log(`DP[i=${i}][s=${s}] = Tổng từ DP[${i-1}][${bd}..${s}] = <b>${window.sd_DP[i][s]}</b>`);
                yield;
            }
            
            // Nếu s là số nguyên tố, cộng dồn vào KQ[i]
            if (isPrime(s)) {
                window.sd_KQ[i] = (window.sd_KQ[i] + window.sd_DP[i][s]) % window.sd_MOD;
                sd_render_kq(i);
                sd_log(`-> Tổng ${s} là Số Nguyên Tố! Cộng thêm ${window.sd_DP[i][s]} vào <b>KQ[${i}]</b>`, true);
                yield;
            }
        }
    }
    
    sd_render_dp_table(-1, -1);
    sd_render_kq(-1);
    sd_log(`\n--- BƯỚC 2: TRẢ LỜI TRUY VẤN O(1) ---`, true);
    yield;

    // Truy vấn KQ[r] - KQ[l-1]
    let kqR = window.sd_KQ[r];
    let kqL = window.sd_KQ[l-1];
    let ans = (kqR - kqL + window.sd_MOD) % window.sd_MOD;
    
    document.getElementById('sd-res-query').innerHTML = `KQ[${r}] - KQ[${l-1}]<br>= ${kqR} - ${kqL}<br>= <span style="font-size:2rem;">${ans}</span>`;
    
    sd_log(`Đếm số SDigit từ độ dài ${l} đến ${r}:`);
    sd_log(`= (Tổng số từ 1..10^${r}-1) - (Tổng số từ 1..10^${l-1}-1)`);
    sd_log(`= KQ[${r}] - KQ[${l-1}]`);
    sd_log(`= ${kqR} - ${kqL} = <b>${ans}</b>`, true);

    document.getElementById('btn-sd-step').disabled = true;
    document.getElementById('btn-sd-auto').disabled = true;
    sd_toggle_auto(true);
}

function sd_step() {
    if (window.sd_generator) window.sd_generator.next();
}

function sd_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-sd-auto');
    if (window.sd_auto_timer || forceStop) {
        clearInterval(window.sd_auto_timer);
        window.sd_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.sd_auto_timer = setInterval(() => {
            if(window.sd_generator) {
                let res = window.sd_generator.next();
                if(res.done) sd_toggle_auto(true);
            }
        }, 150); // Tốc độ chạy nhanh hơn vì bảng nhiều ô
    }
}