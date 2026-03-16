/**
 * FILE MÔ PHỎNG: SẮP XẾP (SAPXEP - HCM 24-25)
 * Tác giả: Gemini
 */

window.sx_N = 0;
window.sx_A = [];
window.sx_Temp = [];
window.sx_Count = 0n;
window.sx_mode = 'sub2';
window.sx_generator = null;
window.sx_auto_timer = null;

function init_hcm2425_sapxep_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Đếm nghịch thế (Bubble Sort vs Merge Sort)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="sx-input" style="width: 150px; height: 80px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="N&#10;Mảng A...">4
3 2 1 4</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="sx-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold; color:#1e293b;">
                            <option value="sub2">Cách 2: Đếm gộp O(N log N) (Merge Sort)</option>
                            <option value="sub1">Cách 1: Tráo thủ công O(N²) (Bubble Sort)</option>
                        </select>
                        <button onclick="sx_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="sx_step()" id="btn-sx-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="sx_toggle_auto()" id="btn-sx-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; min-height: 120px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">MẢNG HIỆN TẠI (A)</div>
                    <div id="sx-array-main" style="display: flex; gap: 5px; flex-wrap: wrap;"></div>
                    
                    <div id="sx-temp-zone" style="display:none; margin-top: 15px; border-top:1px dashed #cbd5e1; padding-top:10px;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#0284c7; margin-bottom:5px;">MẢNG TRỘN TẠM (Temp)</div>
                        <div id="sx-array-temp" style="display: flex; gap: 5px; flex-wrap: wrap;"></div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 15px;">
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 2px solid #22c55e; text-align: center; display:flex; flex-direction:column; justify-content:center;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">SỐ LẦN HOÁN ĐỔI (SỐ NGHỊCH THẾ)</div>
                    <div id="sx-res-count" style="color:#15803d; font-size: 3.5rem; font-weight: 900; line-height: 1;">0</div>
                </div>
                <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; display:flex; flex-direction:column;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:5px;">NHẬT KÝ (LOG)</div>
                    <div id="sx-log" style="font-family: monospace; font-size: 0.85rem; color: #475569; overflow-y: auto; height: 120px; line-height: 1.6; background:white; padding:8px; border:1px solid #fde68a;"></div>
                </div>
            </div>
        </div>
    `;
}

function sx_log(msg, highlight = false) {
    const log = document.getElementById('sx-log');
    let fw = highlight ? "font-weight:bold; color:#ef4444;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #fef08a; padding: 3px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function sx_start() {
    const lines = document.getElementById('sx-input').value.trim().split('\n');
    clearInterval(window.sx_auto_timer);
    document.getElementById('btn-sx-auto').innerHTML = "▶ Tự động";
    window.sx_auto_timer = null;
    window.sx_mode = document.getElementById('sx-mode').value;

    try {
        window.sx_N = parseInt(lines[0].trim());
        window.sx_A = lines[1].trim().split(/\s+/).map(Number);
        if (window.sx_A.length !== window.sx_N) throw new Error();
        
        if (window.sx_N > 20) {
            alert("Để mô phỏng trực quan dễ nhìn, vui lòng nhập mảng N <= 20."); return;
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Dòng 1: N. Dòng 2: Mảng A."); return;
    }

    window.sx_Temp = Array(window.sx_N).fill("");
    window.sx_Count = 0n;
    document.getElementById('sx-res-count').innerText = "0";
    document.getElementById('sx-log').innerHTML = "";
    document.getElementById('sx-temp-zone').style.display = window.sx_mode === 'sub2' ? "block" : "none";
    
    document.getElementById('btn-sx-step').disabled = false;
    document.getElementById('btn-sx-auto').disabled = false;
    
    sx_render_main(-1, -1);
    if (window.sx_mode === 'sub2') sx_render_temp();
    
    if (window.sx_mode === 'sub1') window.sx_generator = logic_sx_bubble();
    else window.sx_generator = logic_sx_merge_start();
    
    sx_log(`Đã nạp mảng ${window.sx_N} phần tử.`, true);
}

function sx_render_main(idx1, idx2, highlightType = "none", mergeData = null) {
    const container = document.getElementById('sx-array-main');
    let html = '';
    
    for (let i = 0; i < window.sx_N; i++) {
        let bg = "#f1f5f9", color = "#475569", border = "1px solid #cbd5e1", scale = "";
        
        // Bubble Sort Highlight
        if (window.sx_mode === 'sub1') {
            if (i === idx1 || i === idx2) {
                if (highlightType === "compare") { bg = "#fef08a"; border = "2px solid #eab308"; } // Vàng
                if (highlightType === "swap") { bg = "#fca5a5"; border = "2px solid #ef4444"; color="white"; scale = "transform:scale(1.1); font-weight:bold;"; } // Đỏ
                if (highlightType === "ok") { bg = "#dcfce7"; border = "2px solid #22c55e"; color="#166534"; } // Xanh
            }
        } 
        // Merge Sort Highlight
        else if (mergeData) {
            // mergeData = {L, mid, R, ptrL, ptrR, flashInv}
            if (i >= mergeData.L && i <= mergeData.mid) {
                bg = "#e0f2fe"; border = "1px solid #38bdf8"; color = "#0369a1"; // Nửa trái (Xanh dương nhạt)
                if (i === mergeData.ptrL) { border = "3px solid #0284c7"; scale = "font-weight:bold;"; }
                // Nếu đang flash Inversion, phần còn lại của Left đỏ lên
                if (mergeData.flashInv && i >= mergeData.ptrL) {
                    bg = "#fecaca"; border = "2px dashed #ef4444"; color = "#b91c1c"; scale = "transform:scale(1.1); font-weight:bold;";
                }
            } else if (i > mergeData.mid && i <= mergeData.R) {
                bg = "#fce7f3"; border = "1px solid #f472b6"; color = "#be185d"; // Nửa phải (Hồng nhạt)
                if (i === mergeData.ptrR) { border = "3px solid #db2777"; scale = "font-weight:bold;"; }
                if (mergeData.flashInv && i === mergeData.ptrR) {
                    bg = "#fecaca"; border = "2px solid #ef4444"; color = "#b91c1c"; scale = "transform:scale(1.1); font-weight:bold;";
                }
            } else {
                color = "#cbd5e1"; // Mờ các phần tử ngoài vùng merge
            }
        }

        html += `<div style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; background: ${bg}; color: ${color}; border: ${border}; border-radius: 4px; font-family: monospace; font-size:1.1rem; transition: all 0.2s; ${scale}">${window.sx_A[i]}</div>`;
    }
    container.innerHTML = html;
}

function sx_render_temp() {
    const container = document.getElementById('sx-array-temp');
    let html = '';
    for (let i = 0; i < window.sx_N; i++) {
        let val = window.sx_Temp[i] !== "" ? window.sx_Temp[i] : "";
        let bg = val !== "" ? "#dcfce7" : "#f8fafc";
        let border = val !== "" ? "1px solid #22c55e" : "1px dashed #cbd5e1";
        html += `<div style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; background: ${bg}; color: #166534; border: ${border}; border-radius: 4px; font-family: monospace; font-weight:bold; font-size:1.1rem;">${val}</div>`;
    }
    container.innerHTML = html;
}

function update_sx_count() {
    document.getElementById('sx-res-count').innerText = window.sx_Count.toString();
}

// SUBTASK 1: BUBBLE SORT
function* logic_sx_bubble() {
    let n = window.sx_N;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            sx_render_main(j, j+1, "compare");
            sx_log(`So sánh A[${j}]=${window.sx_A[j]} và A[${j+1}]=${window.sx_A[j+1]}`);
            yield;

            if (window.sx_A[j] > window.sx_A[j+1]) {
                sx_render_main(j, j+1, "swap");
                sx_log(`=> Lỗi Ngược! Đổi chỗ. (Swap++)`, true);
                
                // Swap
                let temp = window.sx_A[j];
                window.sx_A[j] = window.sx_A[j+1];
                window.sx_A[j+1] = temp;
                
                window.sx_Count++;
                update_sx_count();
                swapped = true;
                yield;
                
                sx_render_main(j, j+1, "ok");
            } else {
                sx_render_main(j, j+1, "ok");
                sx_log(`=> Đúng thứ tự.`);
                yield;
            }
        }
        if (!swapped) break; // Optimization
    }
    sx_render_main(-1, -1);
    sx_log(`\nHOÀN THÀNH! Tổng Swap: ${window.sx_Count}`, true);
    finish_sx();
}

// SUBTASK 2: MERGE SORT
function* logic_sx_merge_start() {
    yield* mergeSortHelper(0, window.sx_N - 1);
    sx_render_main(-1, -1);
    document.getElementById('sx-temp-zone').style.display = "none";
    sx_log(`\nHOÀN THÀNH! Tổng Nghịch thế (Swap): ${window.sx_Count}`, true);
    finish_sx();
}

function* mergeSortHelper(L, R) {
    if (L >= R) return;
    let mid = Math.floor((L + R) / 2);
    yield* mergeSortHelper(L, mid);
    yield* mergeSortHelper(mid + 1, R);
    yield* merge(L, mid, R);
}

function* merge(L, mid, R) {
    sx_log(`--- Gộp đoạn [${L}..${mid}] và [${mid+1}..${R}] ---`);
    window.sx_Temp.fill(""); // Clear temp for visual clarity
    sx_render_temp();
    
    let i = L, j = mid + 1, k = L;
    let mData = {L: L, mid: mid, R: R, ptrL: i, ptrR: j, flashInv: false};
    
    while (i <= mid && j <= R) {
        mData.ptrL = i; mData.ptrR = j; mData.flashInv = false;
        sx_render_main(-1, -1, "none", mData);
        yield; // Pause to show pointers

        if (window.sx_A[i] <= window.sx_A[j]) {
            sx_log(`Trái (${window.sx_A[i]}) <= Phải (${window.sx_A[j]}). Đưa Trái xuống Temp.`);
            window.sx_Temp[k] = window.sx_A[i];
            i++; k++;
        } else {
            // INVERSION DETECTED!
            let jumpedElements = mid - i + 1;
            mData.flashInv = true;
            sx_render_main(-1, -1, "none", mData); // Flash Red
            
            sx_log(`CẢNH BÁO NGHỊCH THẾ!`, true);
            sx_log(`Phải (${window.sx_A[j]}) bé hơn Trái (${window.sx_A[i]}).`);
            sx_log(`=> ${window.sx_A[j]} sẽ vượt qua ${jumpedElements} phần tử bên Trái. Cộng thêm ${jumpedElements}!`, true);
            
            window.sx_Count += BigInt(jumpedElements);
            update_sx_count();
            yield; // Pause on Red flash
            
            window.sx_Temp[k] = window.sx_A[j];
            j++; k++;
        }
        sx_render_temp();
    }

    // Xử lý phần dư
    while (i <= mid) {
        window.sx_Temp[k++] = window.sx_A[i++];
    }
    while (j <= R) {
        window.sx_Temp[k++] = window.sx_A[j++];
    }
    
    mData.ptrL = -1; mData.ptrR = -1; mData.flashInv = false;
    sx_render_main(-1, -1, "none", mData);
    sx_render_temp();
    sx_log(`Hoàn tất trộn vào Temp. Chép ngược lên Mảng A...`);
    yield;

    // Chép ngược
    for (let p = L; p <= R; p++) {
        window.sx_A[p] = window.sx_Temp[p];
    }
    sx_render_main(-1, -1, "none", {L: L, mid: R, R: R, ptrL:-1, ptrR:-1, flashInv:false}); // Show merged result
    window.sx_Temp.fill("");
    sx_render_temp();
    yield;
}

function finish_sx() {
    document.getElementById('btn-sx-step').disabled = true;
    document.getElementById('btn-sx-auto').disabled = true;
    sx_toggle_auto(true);
}

function sx_step() {
    if (window.sx_generator) window.sx_generator.next();
}

function sx_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-sx-auto');
    if (window.sx_auto_timer || forceStop) {
        clearInterval(window.sx_auto_timer);
        window.sx_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.sx_auto_timer = setInterval(() => {
            if(window.sx_generator) {
                let res = window.sx_generator.next();
                if(res.done) sx_toggle_auto(true);
            }
        }, window.sx_mode === 'sub1' ? 400 : 800); // Merge sort cho chạy chậm hơn chút để nhìn log
    }
}