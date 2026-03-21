/**
 * FILE MÔ PHỎNG: TRẠM CẢM BIẾN (TRAMCB - Đề tham khảo 25-26)
 * Tác giả: Gemini
 */

window.tcb_N = 0n;
window.tcb_M = 0n;
window.tcb_mode = 'sub2';
window.tcb_generator = null;
window.tcb_auto_timer = null;

function init_hcm2526_tramcb_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Tìm Ước chung lớn nhất (GCD)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Độ ẩm (N) và Nhiệt độ (M):</label><br>
                    <textarea id="tcb-input" style="width: 180px; height: 60px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="N M">120 160</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="tcb-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold; color:#1e293b;">
                            <option value="sub2">Cách 2: Thuật toán Euclid O(log N)</option>
                            <option value="sub1">Cách 1: Vét cạn vòng lặp lùi O(N)</option>
                        </select>
                        <button onclick="tcb_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="tcb_step()" id="btn-tcb-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="tcb_toggle_auto()" id="btn-tcb-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; display:flex; flex-direction:column; align-items:center;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:15px; text-align:center;">QUÁ TRÌNH TÍNH TOÁN GCD</div>
                    <div id="tcb-visual-box" style="width:100%; display:flex; flex-direction:column; gap:10px;">
                        <div style="text-align:center; color:#94a3b8; font-style:italic;">Bấm Nạp Dữ Liệu để bắt đầu...</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 2px solid #22c55e; text-align: center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">SỐ LƯỢNG TRẠM NHIỀU NHẤT (K)</div>
                        <div id="tcb-res-k" style="color:#15803d; font-size: 2.5rem; font-weight: 900; line-height: 1;">0</div>
                        <div id="tcb-res-detail" style="margin-top:8px; font-weight:bold; color:#166534;">-</div>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; flex: 1; display:flex; flex-direction:column;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:5px;">NHẬT KÝ (LOG)</div>
                        <div id="tcb-log" style="font-family: monospace; font-size: 0.85rem; color: #475569; overflow-y: auto; height: 130px; line-height: 1.6; background:white; padding:8px; border:1px solid #fde68a;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function tcb_log(msg, highlight = false) {
    const log = document.getElementById('tcb-log');
    let fw = highlight ? "font-weight:bold; color:#0284c7;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #fef08a; padding: 4px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function tcb_start() {
    const input = document.getElementById('tcb-input').value.trim();
    clearInterval(window.tcb_auto_timer);
    document.getElementById('btn-tcb-auto').innerHTML = "▶ Tự động";
    window.tcb_auto_timer = null;
    window.tcb_mode = document.getElementById('tcb-mode').value;

    try {
        const parts = input.split(/\s+/);
        window.tcb_N = BigInt(parts[0]);
        window.tcb_M = BigInt(parts[1]);
        
        if (window.tcb_N <= 0n || window.tcb_M <= 0n) throw new Error();
        
        if (window.tcb_mode === 'sub1' && (window.tcb_N > 100000n || window.tcb_M > 100000n)) {
            alert("Chế độ Vét cạn (Sub 1) chỉ cho phép nhập số <= 100000 để tránh treo trình duyệt. Vui lòng chuyển sang Cách 2 (Euclid) để thử với số cực lớn!");
            return;
        }
    } catch(e) {
        alert("Dữ liệu không hợp lệ. Vui lòng nhập 2 số nguyên dương."); return;
    }

    document.getElementById('tcb-res-k').innerText = "0";
    document.getElementById('tcb-res-detail').innerText = "-";
    document.getElementById('tcb-log').innerHTML = "";
    document.getElementById('tcb-visual-box').innerHTML = "";
    
    document.getElementById('btn-tcb-step').disabled = false;
    document.getElementById('btn-tcb-auto').disabled = false;
    
    if (window.tcb_mode === 'sub1') window.tcb_generator = logic_tcb_brute();
    else window.tcb_generator = logic_tcb_euclid();
    
    tcb_log(`Đã nạp N = ${window.tcb_N}, M = ${window.tcb_M}.`, true);
}

function tcb_render_euclid(step, a, b, rem) {
    const box = document.getElementById('tcb-visual-box');
    let bg = rem === 0n ? "#dcfce7" : "#f1f5f9";
    let border = rem === 0n ? "2px solid #22c55e" : "1px solid #cbd5e1";
    let html = `
        <div style="background:${bg}; border:${border}; border-radius:6px; padding:10px; display:flex; justify-content:space-between; align-items:center; font-family:monospace; font-size:1.1rem;">
            <div style="color:#64748b; font-size:0.8rem; width:50px;">BƯỚC ${step}</div>
            <div style="display:flex; gap:10px; align-items:center; font-weight:bold;">
                <span style="color:#0284c7;">GCD(${a}, ${b})</span>
                <span style="color:#94a3b8;">&rarr;</span>
                <span style="color:#ea580c;">${a} % ${b} = ${rem}</span>
            </div>
        </div>
    `;
    box.innerHTML += html;
    // Scroll to bottom
    box.scrollTop = box.scrollHeight;
}

function tcb_render_brute(i, n_mod, m_mod) {
    const box = document.getElementById('tcb-visual-box');
    let isOk = (n_mod === 0n && m_mod === 0n);
    let color = isOk ? "#15803d" : "#ef4444";
    
    box.innerHTML = `
        <div style="background:#fef08a; border:2px solid #eab308; border-radius:8px; padding:20px; text-align:center;">
            <div style="font-size:1rem; color:#a16207; font-weight:bold; margin-bottom:10px;">ĐANG THỬ CHIA CHO i = ${i}</div>
            <div style="font-family:monospace; font-size:1.2rem; font-weight:bold; color:${color};">
                ${window.tcb_N} % ${i} = ${n_mod}<br>
                ${window.tcb_M} % ${i} = ${m_mod}
            </div>
        </div>
    `;
}

function* logic_tcb_brute() {
    tcb_log(`\n--- VÉT CẠN: TÌM K BẰNG VÒNG LẶP ---`, true);
    
    let minVal = window.tcb_N < window.tcb_M ? window.tcb_N : window.tcb_M;
    let K = 1n;

    for (let i = minVal; i >= 1n; i--) {
        let modN = window.tcb_N % i;
        let modM = window.tcb_M % i;
        
        tcb_render_brute(i, modN, modM);
        tcb_log(`Thử i = ${i}: N dư ${modN}, M dư ${modM}`);
        yield;
        
        if (modN === 0n && modM === 0n) {
            K = i;
            tcb_log(`=> ${i} là số LỚN NHẤT chia hết cho cả 2. Dừng!`, true);
            break;
        }
    }
    
    tcb_finish(K);
}

function* logic_tcb_euclid() {
    tcb_log(`\n--- THUẬT TOÁN EUCLID: GCD(A, B) = GCD(B, A % B) ---`, true);
    
    let A = window.tcb_N;
    let B = window.tcb_M;
    let step = 1;

    while (B !== 0n) {
        let R = A % B;
        tcb_render_euclid(step, A, B, R);
        tcb_log(`Bước ${step}: GCD(${A}, ${B}) => Số dư = ${R}`);
        yield;
        
        A = B;
        B = R;
        step++;
    }
    
    tcb_log(`=> Số dư = 0. Ước chung lớn nhất là ${A}!`, true);
    tcb_finish(A);
}

function tcb_finish(K) {
    document.getElementById('tcb-res-k').innerText = K.toString();
    
    let soil = window.tcb_N / K;
    let temp = window.tcb_M / K;
    document.getElementById('tcb-res-detail').innerHTML = `${soil} Độ ẩm & ${temp} Nhiệt độ / 1 Trạm`;
    
    tcb_log(`\nKẾT QUẢ CUỐI CÙNG:`, true);
    tcb_log(`- Dòng 1 (Số trạm): <b>${K}</b>`);
    tcb_log(`- Dòng 2 (Mỗi trạm): <b>${soil} ${temp}</b>`);

    document.getElementById('btn-tcb-step').disabled = true;
    document.getElementById('btn-tcb-auto').disabled = true;
    tcb_toggle_auto(true);
}

function tcb_step() {
    if (window.tcb_generator) window.tcb_generator.next();
}

function tcb_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-tcb-auto');
    if (window.tcb_auto_timer || forceStop) {
        clearInterval(window.tcb_auto_timer);
        window.tcb_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.tcb_auto_timer = setInterval(() => {
            if(window.tcb_generator) {
                let res = window.tcb_generator.next();
                if(res.done) tcb_toggle_auto(true);
            }
        }, 1000); 
    }
}