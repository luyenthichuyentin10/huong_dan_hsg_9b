/**
 * FILE MÔ PHỎNG: TRUNG BÌNH CỘNG (TBC - HCM 22-23)
 * Cập nhật: Fix lỗi cú pháp hiển thị giao diện
 */

window.tbc_N = 0;
window.tbc_B = [];
window.tbc_A = [];
window.tbc_mode = 'sub2';
window.tbc_generator = null;
window.tbc_auto_timer = null;

function init_hcm2223_tbc_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Khôi phục Mảng từ Trung Bình Cộng</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập N và Mảng B:</label><br>
                    <textarea id="tbc-input" style="width: 180px; height: 120px; padding: 5px; font-family: monospace; font-size: 1.1rem;" placeholder="Nhập N&#10;Nhập mảng B...">5
15 20 5 10 20</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="tbc-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold; color:#1e293b;">
                            <option value="sub2">Cách 2: O(N) - Công thức Toán (Sub2)</option>
                            <option value="sub1">Cách 1: O(N²) - Vét cạn ngây thơ (Sub1)</option>
                        </select>
                        <button onclick="tbc_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="tbc_step()" id="btn-tbc-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="tbc_toggle_auto()" id="btn-tbc-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="background: #fffbeb; border: 1px dashed #f59e0b; padding: 10px; border-radius: 8px; text-align: center; margin-top:5px;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#b45309; margin-bottom:5px;">BẢNG TÍNH TOÁN HIỆN TẠI</div>
                        <div id="tbc-calc-box" style="font-family:monospace; font-size:1.2rem; color:#92400e; font-weight:bold;">-</div>
                    </div>
                </div>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; overflow-x: auto;">
                <div id="tbc-arrays" style="min-width: max-content;"></div>
            </div>

            <div id="tbc-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập mảng B và nhấn Nạp Dữ Liệu...
            </div>
        </div>
    `;
}

function tbc_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('tbc-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function tbc_start() {
    const lines = document.getElementById('tbc-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.tbc_auto_timer);
    document.getElementById('btn-tbc-auto').innerHTML = "▶ Tự động";
    window.tbc_auto_timer = null;

    window.tbc_mode = document.getElementById('tbc-mode').value;

    try {
        window.tbc_N = parseInt(lines[0].trim());
        window.tbc_B = lines[1].trim().split(/\s+/).map(Number);
        if (window.tbc_B.length !== window.tbc_N) throw new Error();
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Vui lòng kiểm tra lại N và mảng B."); return;
    }

    window.tbc_A = Array(window.tbc_N).fill('?');
    
    document.getElementById('tbc-calc-box').innerHTML = "-";
    document.getElementById('tbc-log').innerHTML = "";
    document.getElementById('btn-tbc-step').disabled = false;
    document.getElementById('btn-tbc-auto').disabled = false;
    
    tbc_render_arrays(-1, -1, []);
    
    if (window.tbc_mode === 'sub1') window.tbc_generator = logic_tbc_sub1();
    else window.tbc_generator = logic_tbc_sub2();
    
    tbc_log(`Đã nạp mảng B. Chế độ giải: ${window.tbc_mode === 'sub1' ? "O(N²) - Vét cạn" : "O(N) - Tối ưu"}`, "#38bdf8");
}

function tbc_render_arrays(activeB, activeA, sumA_Indices = [], highlightPrevB = -1) {
    const container = document.getElementById('tbc-arrays');
    let N = window.tbc_N;
    
    let html = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 1.1rem; width: 100%;">`;
    
    // Chỉ số (1-based)
    html += `<tr><td style="padding: 8px; font-weight:bold; color:#64748b; border:1px solid #cbd5e1; width:80px;">i</td>`;
    for(let i=0; i<N; i++) html += `<td style="padding: 8px; border:1px solid #cbd5e1; color:#94a3b8;">${i+1}</td>`;
    html += `</tr>`;

    // Mảng B (Input)
    html += `<tr><td style="padding: 8px; font-weight:bold; color:#0284c7; border:1px solid #cbd5e1; background:#f0f9ff;">Mảng B</td>`;
    for(let i=0; i<N; i++) {
        let bg = "white", border = "1px solid #cbd5e1", scale = "";
        if (i === activeB) {
            bg = "#bae6fd"; border = "2px solid #0284c7"; scale = "transform: scale(1.1); font-weight:bold;";
        } else if (i === highlightPrevB) {
            bg = "#fef08a"; border = "2px dashed #ca8a04"; scale = "font-weight:bold;"; // Vàng cho B[i-1]
        }
        html += `<td style="padding: 8px; border:${border}; background:${bg}; transition:all 0.3s; ${scale}">${window.tbc_B[i]}</td>`;
    }
    html += `</tr>`;

    // Mảng A (Output)
    html += `<tr><td style="padding: 8px; font-weight:bold; color:#15803d; border:1px solid #cbd5e1; background:#f0fdf4;">Mảng A</td>`;
    for(let i=0; i<N; i++) {
        let bg = "white", color = "#1e293b", border = "1px solid #cbd5e1", scale = "";
        let val = window.tbc_A[i];
        
        if (i === activeA) {
            bg = "#bbf7d0"; border = "2px solid #166534"; scale = "transform: scale(1.1); font-weight:bold;"; color = "#166534";
        } else if (sumA_Indices.includes(i)) {
            bg = "#fce7f3"; border = "2px dashed #be185d"; color = "#be185d"; // Bôi hồng để tính tổng (Sub1)
        } else if (val !== '?') {
            color = "#15803d"; scale = "font-weight:bold;"; // ĐÃ FIX LỖI TẠI ĐÂY
        } else {
            color = "#cbd5e1";
        }
        html += `<td style="padding: 8px; border:${border}; background:${bg}; color:${color}; transition:all 0.3s; ${scale}">${val}</td>`;
    }
    html += `</tr></table>`;
    
    container.innerHTML = html;
}

function* logic_tbc_sub1() {
    let N = window.tbc_N;
    tbc_log(`\nBắt đầu Vét cạn O(N²)`, "#c084fc");

    for (let i = 0; i < N; i++) {
        tbc_log(`\n--- Tính A[${i+1}] ---`);
        tbc_render_arrays(i, i, []);
        
        let target_sum = window.tbc_B[i] * (i + 1);
        document.getElementById('tbc-calc-box').innerHTML = `Sum Mục tiêu = B[${i+1}] × ${i+1} = ${window.tbc_B[i]} × ${i+1} = <span style="color:#0284c7;">${target_sum}</span>`;
        tbc_log(`Tổng của ${i+1} phần tử đầu tiên phải là: ${target_sum}`);
        yield;

        let known_sum = 0;
        let sum_indices = [];
        
        if (i > 0) {
            tbc_log(`Vòng lặp trong: Quét lại các phần tử A đã tìm...`, "#f59e0b");
            for (let j = 0; j < i; j++) {
                sum_indices.push(j);
                known_sum += window.tbc_A[j];
                tbc_render_arrays(i, i, sum_indices);
                document.getElementById('tbc-calc-box').innerHTML = `Sum Đã biết: <span style="color:#be185d;">${known_sum}</span>`;
                tbc_log(`  + Cộng A[${j+1}] = ${window.tbc_A[j]} -> Sum đã biết: ${known_sum}`);
                yield;
            }
        }

        window.tbc_A[i] = target_sum - known_sum;
        document.getElementById('tbc-calc-box').innerHTML = `A[${i+1}] = <span style="color:#0284c7;">${target_sum}</span> - <span style="color:#be185d;">${known_sum}</span> = <span style="color:#15803d; font-size:1.5rem;">${window.tbc_A[i]}</span>`;
        tbc_render_arrays(i, i, []);
        tbc_log(`=> A[${i+1}] = ${target_sum} - ${known_sum} = <b>${window.tbc_A[i]}</b>`, "#10b981");
        yield;
    }

    tbc_render_arrays(-1, -1, []);
    document.getElementById('tbc-calc-box').innerHTML = "Hoàn thành mảng A!";
    tbc_log(`\nHOÀN THÀNH (Vét cạn)!`, "#fbbf24");
    
    document.getElementById('btn-tbc-step').disabled = true;
    document.getElementById('btn-tbc-auto').disabled = true;
    tbc_toggle_auto(true);
}

function* logic_tbc_sub2() {
    let N = window.tbc_N;
    tbc_log(`\nBắt đầu Tối ưu Toán học O(N)`, "#c084fc");

    for (let i = 0; i < N; i++) {
        tbc_log(`\n--- Tính A[${i+1}] ---`);
        
        let sum_curr = window.tbc_B[i] * (i + 1);
        let sum_prev = 0;
        
        if (i === 0) {
            tbc_render_arrays(i, i, [], -1);
            window.tbc_A[i] = sum_curr;
            document.getElementById('tbc-calc-box').innerHTML = `A[1] = Sum(1) = B[1] × 1 = ${window.tbc_B[i]} = <span style="color:#15803d; font-size:1.5rem;">${window.tbc_A[i]}</span>`;
            tbc_log(`Phần tử đầu tiên: A[1] = B[1] = <b>${window.tbc_A[i]}</b>`, "#10b981");
            yield;
        } else {
            tbc_render_arrays(i, i, [], i-1); // Highlight B[i] và B[i-1]
            sum_prev = window.tbc_B[i-1] * i;
            window.tbc_A[i] = sum_curr - sum_prev;
            
            document.getElementById('tbc-calc-box').innerHTML = `Sum(${i+1}) - Sum(${i}) = (<span style="color:#0284c7;">${window.tbc_B[i]}×${i+1}</span>) - (<span style="color:#ca8a04;">${window.tbc_B[i-1]}×${i}</span>) = <span style="color:#15803d; font-size:1.5rem;">${window.tbc_A[i]}</span>`;
            
            tbc_log(`Sum(${i+1}) = B[${i+1}] × ${i+1} = ${sum_curr}`, "#0284c7");
            tbc_log(`Sum(${i}) = B[${i}] × ${i} = ${sum_prev}`, "#ca8a04");
            tbc_log(`=> A[${i+1}] = ${sum_curr} - ${sum_prev} = <b>${window.tbc_A[i]}</b>`, "#10b981");
            yield;
        }
    }

    tbc_render_arrays(-1, -1, []);
    document.getElementById('tbc-calc-box').innerHTML = "Hoàn thành mảng A!";
    tbc_log(`\nHOÀN THÀNH (Tối ưu O(N))!`, "#fbbf24");
    
    document.getElementById('btn-tbc-step').disabled = true;
    document.getElementById('btn-tbc-auto').disabled = true;
    tbc_toggle_auto(true);
}

function tbc_step() {
    if (window.tbc_generator) window.tbc_generator.next();
}

function tbc_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-tbc-auto');
    if (window.tbc_auto_timer || forceStop) {
        clearInterval(window.tbc_auto_timer);
        window.tbc_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.tbc_auto_timer = setInterval(() => {
            if(window.tbc_generator) {
                let res = window.tbc_generator.next();
                if(res.done) tbc_toggle_auto(true);
            }
        }, window.tbc_mode === 'sub1' ? 800 : 1500); 
    }
}