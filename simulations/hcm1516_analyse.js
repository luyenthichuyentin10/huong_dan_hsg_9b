/**
 * FILE MÔ PHỎNG: PHÂN TÍCH SỐ (ANALYSE - HCM 15-16)
 * Tác giả: Gemini
 */

window.analyse_I = 0n;
window.analyse_J = 0n;
window.analyse_mode = 'optimal';
window.analyse_generator = null;
window.analyse_auto_timer = null;

function init_hcm1516_analyse_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Tìm ước số và tính tổng (ANALYSE)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div>Số I: <input type="text" id="ana-i" value="12" style="width:120px; padding:5px; border-radius:4px; border:1px solid #cbd5e1;"></div>
                    <div>Số J: <input type="text" id="ana-j" value="6" style="width:120px; padding:5px; border-radius:4px; border:1px solid #cbd5e1;"></div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                    <select id="ana-mode" style="padding:5px; border-radius:4px; border:1px solid #cbd5e1;">
                        <option value="optimal">Cách 2: Duyệt đến √N (Tìm cặp ước - O(√N))</option>
                        <option value="naive">Cách 1: Duyệt đến N (Vét cạn - O(N))</option>
                    </select>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="analyse_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Ngẫu nhiên</button>
                        <button onclick="analyse_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Phân tích</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="analyse_step()" id="btn-ana-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Quét tiếp</button>
                        <button onclick="analyse_toggle_auto()" id="btn-ana-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#1e293b; margin-bottom:10px;">Đang phân tích số: <span id="ana-current-num" style="color:#2563eb; font-size:1.2rem;">-</span></div>
                    <div id="ana-math-visual" style="font-family:monospace; font-size:1.1rem; margin-bottom:15px; min-height: 25px;"></div>
                    
                    <div style="font-size:0.85rem; color:#64748b; margin-bottom:5px;">Tập hợp các ước số tìm được:</div>
                    <div id="ana-divisors-box" style="display:flex; gap:8px; flex-wrap:wrap; min-height:40px; padding:10px; background:#f8fafc; border-radius:6px; border:1px dashed #cbd5e1;"></div>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div style="background: #eff6ff; padding: 10px; border-radius: 8px; border: 1px solid #bfdbfe; text-align: center;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#1e40af;">TỔNG ƯỚC CỦA I</div>
                        <div id="ana-sum-i" style="color:#1d4ed8; font-size: 1.8rem; font-weight: 900;">0</div>
                    </div>
                    <div style="background: #eff6ff; padding: 10px; border-radius: 8px; border: 1px solid #bfdbfe; text-align: center;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#1e40af;">TỔNG ƯỚC CỦA J</div>
                        <div id="ana-sum-j" style="color:#1d4ed8; font-size: 1.8rem; font-weight: 900;">0</div>
                    </div>
                    <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 2px solid #22c55e; text-align: center;">
                        <div style="font-size:0.9rem; font-weight:bold; color:#166534;">TỔNG CUỐI CÙNG</div>
                        <div id="ana-sum-total" style="color:#15803d; font-size: 2.2rem; font-weight: 900;">0</div>
                    </div>
                </div>
            </div>

            <div id="ana-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập I, J và nhấn Phân tích...
            </div>
        </div>
    `;
}

function analyse_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('ana-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function analyse_random() {
    // Random sinh số lớn (ví dụ từ 100 đến 10000 để mô phỏng)
    document.getElementById('ana-i').value = Math.floor(Math.random() * 5000) + 100;
    // J có thể là số chính phương để xem hiệu ứng tránh trùng lặp
    let root = Math.floor(Math.random() * 50) + 10;
    document.getElementById('ana-j').value = root * root;
    analyse_start();
}

function analyse_start() {
    try {
        window.analyse_I = BigInt(document.getElementById('ana-i').value.trim());
        window.analyse_J = BigInt(document.getElementById('ana-j').value.trim());
        if (window.analyse_I <= 0n || window.analyse_J <= 0n) throw new Error();
    } catch(e) {
        alert("I và J phải là số nguyên dương."); return;
    }

    clearInterval(window.analyse_auto_timer);
    document.getElementById('btn-ana-auto').innerHTML = "▶ Tự động";
    window.analyse_auto_timer = null;
    window.analyse_mode = document.getElementById('ana-mode').value;

    document.getElementById('ana-sum-i').innerText = "0";
    document.getElementById('ana-sum-j').innerText = "0";
    document.getElementById('ana-sum-total').innerText = "0";
    document.getElementById('ana-divisors-box').innerHTML = "";
    document.getElementById('ana-log').innerHTML = "";
    
    document.getElementById('btn-ana-step').disabled = false;
    document.getElementById('btn-ana-auto').disabled = false;

    window.analyse_generator = logic_analyse();
    analyse_log(`Bắt đầu giải quyết I = ${window.analyse_I}, J = ${window.analyse_J}`, "#38bdf8");
    analyse_step();
}

function add_divisor_ui(val, highlightColor) {
    const box = document.getElementById('ana-divisors-box');
    const el = document.createElement('div');
    el.style = `background:${highlightColor}; color:white; padding:4px 10px; border-radius:4px; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;`;
    el.innerText = val.toString();
    box.appendChild(el);
    
    // Animation scale
    setTimeout(() => el.style.transform = "scale(1.1)", 50);
    setTimeout(() => el.style.transform = "scale(1)", 250);
}

function* logic_analyse() {
    let total_sum = 0n;
    let targets = [
        { name: 'I', val: window.analyse_I, ui_id: 'ana-sum-i' },
        { name: 'J', val: window.analyse_J, ui_id: 'ana-sum-j' }
    ];

    for (let target of targets) {
        let N = target.val;
        let sum_N = 0n;
        document.getElementById('ana-current-num').innerText = N.toString();
        document.getElementById('ana-divisors-box').innerHTML = ""; // Reset box cho số mới
        
        analyse_log(`\n--- PHÂN TÍCH SỐ ${target.name} = ${N} ---`, "#c084fc");

        if (window.analyse_mode === 'optimal') {
            analyse_log(`Chế độ Cặp ước (Lặp đến √N)`, "#94a3b8");
            for (let i = 1n; i * i <= N; i++) {
                document.getElementById('ana-math-visual').innerHTML = `Thử chia: ${N} % ${i} = <span style="color:#ef4444;">${N % i}</span>`;
                
                if (N % i === 0n) {
                    // Tìm thấy ước i
                    sum_N += i;
                    add_divisor_ui(i, "#3b82f6");
                    analyse_log(`+ Tìm thấy ước nhỏ: ${i}`, "#38bdf8");
                    
                    // Suy ra ước lớn
                    let j = N / i;
                    if (j !== i) {
                        sum_N += j;
                        add_divisor_ui(j, "#10b981");
                        document.getElementById('ana-math-visual').innerHTML += ` ➝ Cặp tương ứng: ${N}/${i} = <span style="color:#10b981;">${j}</span>`;
                        analyse_log(`  -> Suy ra ước lớn: ${j}`, "#10b981");
                    } else {
                        document.getElementById('ana-math-visual').innerHTML += ` ➝ (Số chính phương, bỏ qua cặp trùng)`;
                        analyse_log(`  -> Ước cặp bị trùng (${j}), bỏ qua để tránh cộng 2 lần.`, "#f59e0b");
                    }
                    
                    document.getElementById(target.ui_id).innerText = sum_N.toString();
                    document.getElementById('ana-sum-total').innerText = (total_sum + sum_N).toString();
                    yield; // Dừng một nhịp khi tìm thấy ước
                }
            }
        } 
        else {
            // Chế độ Naive
            analyse_log(`Chế độ Vét cạn (Lặp đến N)`, "#94a3b8");
            let max_steps = 100000n; // Bảo vệ trình duyệt
            let fast_forward = 0n;

            for (let i = 1n; i <= N; i++) {
                if (N % i === 0n) {
                    sum_N += i;
                    add_divisor_ui(i, "#64748b");
                    document.getElementById('ana-math-visual').innerHTML = `Thử chia: ${N} % ${i} = 0`;
                    analyse_log(`+ Tìm thấy ước: ${i}`);
                    document.getElementById(target.ui_id).innerText = sum_N.toString();
                    document.getElementById('ana-sum-total').innerText = (total_sum + sum_N).toString();
                    yield; // Chỉ dừng khi tìm thấy ước
                }

                fast_forward++;
                if (fast_forward > max_steps) {
                    analyse_log(`Vòng lặp đã quét qua ${max_steps} số. Tự động dừng để chống treo trình duyệt (Mô phỏng lỗi TLE).`, "#ef4444");
                    break;
                }
            }
        }
        
        total_sum += sum_N;
        analyse_log(`Hoàn tất phân tích ${target.name}. Tổng = ${sum_N}`, "#fbbf24");
        yield;
    }

    analyse_log(`\nHOÀN THÀNH TOÀN BỘ! Kết quả cuối cùng: ${total_sum}`, "#22c55e");
    document.getElementById('btn-ana-step').disabled = true;
    document.getElementById('btn-ana-auto').disabled = true;
    analyse_toggle_auto(true);
}

function analyse_step() {
    if (window.analyse_generator) {
        window.analyse_generator.next();
    }
}

function analyse_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-ana-auto');
    if (window.analyse_auto_timer || forceStop) {
        clearInterval(window.analyse_auto_timer);
        window.analyse_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.analyse_auto_timer = setInterval(() => {
            if(window.analyse_generator) {
                let res = window.analyse_generator.next();
                if(res.done) analyse_toggle_auto(true);
            }
        }, 600); // 600ms mỗi nhịp để dễ quan sát cặp ước nhảy ra
    }
}