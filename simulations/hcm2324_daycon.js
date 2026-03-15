/**
 * FILE MÔ PHỎNG: DÃY CON (DAYCON - HCM 23-24)
 * Tác giả: Gemini
 */

window.dc_N = 0;
window.dc_K = 0;
window.dc_A = [];
window.dc_mode = 'sub3';
window.dc_generator = null;
window.dc_auto_timer = null;

function init_hcm2324_daycon_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Tìm kiếm Dãy con (Two Pointers / Sliding Window)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="dc-input" style="width: 160px; height: 100px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="n k&#10;Mảng A">5 6
1 2 1 4 5</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="dc-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold;">
                            <option value="sub3">Cách 3: Hai con trỏ O(N) (Sliding Window)</option>
                            <option value="sub2">Cách 2: Vét cạn 2 vòng lặp O(N²)</option>
                            <option value="sub1">Cách 1: Vét cạn 3 vòng lặp O(N³)</option>
                        </select>
                        <button onclick="dc_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="dc_step()" id="btn-dc-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="dc_toggle_auto()" id="btn-dc-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top:5px;">
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fde047; flex:1; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#b45309;">TỔNG HIỆN TẠI (So với K = <span id="lbl-k-target">0</span>)</div>
                            <div id="dc-curr-sum" style="font-size:1.8rem; font-weight:bold; color:#ea580c;">0</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 2px solid #22c55e; flex:1; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534;">SỐ DÃY CON TÌM ĐƯỢC</div>
                            <div id="dc-res-total" style="font-size:1.8rem; font-weight:bold; color:#15803d;">0</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x: auto;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px;">MẢNG A (Con trỏ L và R)</div>
                    <div id="dc-array-display" style="display: flex; gap: 4px; padding-top: 25px; padding-bottom: 10px;"></div>
                </div>
            </div>

            <div id="dc-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập dữ liệu và chọn thuật toán...
            </div>
        </div>
    `;
}

function dc_log(msg, highlight = false) {
    const log = document.getElementById('dc-log');
    let style = highlight ? "color:#10b981; font-weight:bold;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #333; padding: 3px 0; ${style}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function dc_start() {
    const lines = document.getElementById('dc-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.dc_auto_timer);
    document.getElementById('btn-dc-auto').innerHTML = "▶ Tự động";
    window.dc_auto_timer = null;
    window.dc_mode = document.getElementById('dc-mode').value;

    try {
        const [N, K] = lines[0].trim().split(/\s+/).map(Number);
        window.dc_N = N;
        window.dc_K = K;
        window.dc_A = lines[1].trim().split(/\s+/).map(Number);
        
        if (window.dc_A.length !== window.dc_N) throw new Error();
        if (window.dc_mode === 'sub1' && window.dc_N > 15) {
            alert("Sub 1 (O(N³)) chạy trên mảng lớn sẽ đơ trình duyệt. Hệ thống giới hạn hiển thị. Hãy chọn Sub 2 hoặc 3.");
            return;
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu."); return;
    }

    document.getElementById('lbl-k-target').innerText = window.dc_K;
    document.getElementById('dc-curr-sum').innerText = "0";
    document.getElementById('dc-res-total').innerText = "0";
    document.getElementById('dc-log').innerHTML = "";
    
    document.getElementById('btn-dc-step').disabled = false;
    document.getElementById('btn-dc-auto').disabled = false;
    
    dc_render_array(-1, -1, -1, []);
    
    if (window.dc_mode === 'sub1') window.dc_generator = logic_dc_sub1();
    else if (window.dc_mode === 'sub2') window.dc_generator = logic_dc_sub2();
    else window.dc_generator = logic_dc_sub3();
    
    dc_log(`Đã nạp mảng ${window.dc_N} phần tử. Mục tiêu: Tổng >= ${window.dc_K}`);
}

function dc_render_array(L, R, currentI = -1, batchIndices = []) {
    const container = document.getElementById('dc-array-display');
    let html = '';
    
    for (let i = 0; i < window.dc_N; i++) {
        let val = window.dc_A[i];
        let bg = "white", color = "#475569", border = "1px solid #cbd5e1";
        let pointerHtml = "";
        
        // Đang nằm trong vùng cửa sổ [L..R]
        if (i >= L && i <= R && L !== -1) {
            bg = "#fef9c3"; border = "2px solid #facc15"; color = "#a16207"; // Vàng
        }
        
        // Vòng lặp thứ 3 (Sub1)
        if (i === currentI) {
            bg = "#fca5a5"; border = "2px solid #ef4444"; color = "#7f1d1d"; // Đỏ nhạt
        }

        // Vùng cộng dồn tự động (Sub3)
        if (batchIndices.includes(i)) {
            bg = "#dcfce7"; border = "2px dashed #22c55e"; color = "#166534"; // Xanh lá
        }

        // Pointers
        if (i === L && i === R) {
            pointerHtml = `<div style="position:absolute; top:-25px; left:50%; transform:translateX(-50%); font-weight:bold; color:#0284c7;">L/R</div>`;
            border = "2px solid #0284c7";
        } else {
            if (i === L) {
                pointerHtml = `<div style="position:absolute; top:-25px; left:50%; transform:translateX(-50%); font-weight:bold; color:#0284c7;">L</div>`;
                border = "2px solid #0284c7";
            }
            if (i === R) {
                pointerHtml = `<div style="position:absolute; top:-25px; left:50%; transform:translateX(-50%); font-weight:bold; color:#be185d;">R</div>`;
                border = "2px solid #be185d";
            }
        }

        html += `
            <div style="position:relative; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; background: ${bg}; color: ${color}; border: ${border}; border-radius: 6px; font-size: 1.2rem; font-family: monospace; font-weight:bold; transition: all 0.2s;">
                ${pointerHtml}
                ${val}
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function update_ui(sum, count, isSuccess = false) {
    let sumEl = document.getElementById('dc-curr-sum');
    sumEl.innerText = sum;
    if (isSuccess) sumEl.style.color = "#15803d"; // Xanh
    else sumEl.style.color = "#ea580c"; // Cam
    
    document.getElementById('dc-res-total').innerText = count;
}

function* logic_dc_sub1() {
    dc_log(`\n--- VÉT CẠN O(N³) ---`);
    let n = window.dc_N;
    let k = window.dc_K;
    let count = 0;

    for (let L = 0; L < n; L++) {
        for (let R = L; R < n; R++) {
            dc_render_array(L, R, -1);
            dc_log(`Xét đoạn [L=${L}, R=${R}]`);
            yield;
            
            let sum = 0;
            for (let i = L; i <= R; i++) {
                sum += window.dc_A[i];
                dc_render_array(L, R, i);
                update_ui(sum, count);
                dc_log(`  + Cộng A[${i}] = ${window.dc_A[i]} -> Tổng = ${sum}`);
                yield;
            }
            
            if (sum >= k) {
                count++;
                update_ui(sum, count, true);
                dc_log(`=> TỔNG ${sum} >= ${k}. TĂNG ĐẾM LÊN ${count}!`, true);
                yield;
            } else {
                dc_log(`=> Tổng ${sum} < ${k}. Bỏ qua.`);
            }
        }
    }
    dc_render_array(-1, -1);
    dc_log(`\nHOÀN THÀNH. Tổng: ${count} dãy con.`);
    finish_sim();
}

function* logic_dc_sub2() {
    dc_log(`\n--- CỘNG DỒN O(N²) ---`);
    let n = window.dc_N;
    let k = window.dc_K;
    let count = 0;

    for (let L = 0; L < n; L++) {
        let sum = 0;
        dc_log(`Cố định L=${L}`);
        for (let R = L; R < n; R++) {
            sum += window.dc_A[R];
            dc_render_array(L, R, -1);
            update_ui(sum, count);
            
            dc_log(`Tịnh tiến R=${R} -> Cộng A[${R}]=${window.dc_A[R]}. Tổng: ${sum}`);
            yield;
            
            if (sum >= k) {
                count++;
                update_ui(sum, count, true);
                dc_log(`=> TỔNG ${sum} >= ${k}. TĂNG ĐẾM LÊN ${count}!`, true);
                yield;
            }
        }
    }
    dc_render_array(-1, -1);
    dc_log(`\nHOÀN THÀNH. Tổng: ${count} dãy con.`);
    finish_sim();
}

function* logic_dc_sub3() {
    dc_log(`\n--- HAI CON TRỎ O(N) ---`);
    let n = window.dc_N;
    let k = window.dc_K;
    let count = 0;
    let sum = 0;
    let R = 0;

    for (let L = 0; L < n; L++) {
        dc_log(`\nCố định L=${L} (A[${L}] = ${window.dc_A[L]})`);
        dc_render_array(L, R === n ? n - 1 : Math.max(L, R-1));
        yield;

        while (R < n && sum < k) {
            sum += window.dc_A[R];
            dc_render_array(L, R);
            update_ui(sum, count);
            dc_log(`Dịch R=${R} sang phải, nạp A[${R}]=${window.dc_A[R]}. Tổng = ${sum}`);
            R++;
            yield;
        }

        if (sum >= k) {
            let actual_R = R - 1; // R đã ++ ở vòng while
            let valid_count = n - actual_R;
            count += valid_count;
            update_ui(sum, count, true);
            
            // Vẽ chuỗi batch màu xanh lá
            let batch = [];
            for(let i = actual_R; i < n; i++) batch.push(i);
            dc_render_array(L, actual_R, -1, batch);
            
            dc_log(`Đã đủ ${k}! Vì các số > 0, mọi đoạn kéo dài về sau đều thỏa mãn.`, true);
            dc_log(`=> Đoạn từ L=${L} đến R=${actual_R}...${n-1} đều ok. Cộng thêm (n - R) = ${n} - ${actual_R} = <b>${valid_count}</b> dãy con!`, true);
            yield;
        } else {
            dc_log(`R đã chạy hết mảng nhưng tổng vẫn < ${k}. Kết thúc tìm kiếm từ L=${L}.`);
        }

        sum -= window.dc_A[L];
        dc_log(`Tháo A[${L}] = ${window.dc_A[L]} ra khỏi cửa sổ. Tổng lùi về: ${sum}`);
        yield;
    }

    dc_render_array(-1, -1);
    dc_log(`\nHOÀN THÀNH TOÀN BỘ. Tổng: ${count} dãy con. Thuật toán O(N) kết thúc.`);
    finish_sim();
}

function finish_sim() {
    document.getElementById('btn-dc-step').disabled = true;
    document.getElementById('btn-dc-auto').disabled = true;
    dc_toggle_auto(true);
}

function dc_step() {
    if (window.dc_generator) window.dc_generator.next();
}

function dc_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-dc-auto');
    if (window.dc_auto_timer || forceStop) {
        clearInterval(window.dc_auto_timer);
        window.dc_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.dc_auto_timer = setInterval(() => {
            if(window.dc_generator) {
                let res = window.dc_generator.next();
                if(res.done) dc_toggle_auto(true);
            }
        }, 0); 
    }
}