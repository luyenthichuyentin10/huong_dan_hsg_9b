/**
 * FILE MÔ PHỎNG: GIẢI ĐẤU (GIAIDAU - HCM 24-25)
 * Tác giả: Gemini
 */

window.gd_N = 0;
window.gd_A = [];
window.gd_P = [0n]; // Prefix sum, dùng BigInt
window.gd_Queries = [];
window.gd_mode = 'sub3';
window.gd_curr_q = 0;
window.gd_generator = null;
window.gd_auto_timer = null;

function init_hcm2425_giaidau_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Prefix Sum & Binary Search</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="gd-input" style="width: 150px; height: 120px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="N Q&#10;Mảng A...&#10;u1 v1&#10;u2 v2...">6 2
4 2 2 1 5 6
1 4
2 5</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="gd-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold; color:#1e293b;">
                            <option value="sub3">Cách 3: Chặt nhị phân O(Q log N)</option>
                            <option value="sub2">Cách 2: Quét vách ngăn O(Q * N)</option>
                        </select>
                        <button onclick="gd_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="gd_step()" id="btn-gd-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Giải Truy vấn tiếp theo</button>
                        <button onclick="gd_toggle_auto()" id="btn-gd-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x:auto;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">MẢNG PREFIX SUM (P)</div>
                    <div id="gd-pref-container" style="display: flex; gap: 2px; margin-bottom: 15px;"></div>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:5px;">TRUY VẤN: ĐOẠN [U, V]</div>
                        <div id="gd-target-box" style="display:none; background:#fef08a; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.8rem; color:#a16207; border:1px solid #eab308;">Target Tìm kiếm: -</div>
                    </div>
                    <div id="gd-array-container" style="display: flex; gap: 4px; position: relative; padding: 10px 0;"></div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; display:flex; flex-direction:column;">
                    <div style="display:flex; justify-content:space-between; text-align:center;">
                        <div style="flex:1; background:#e0f2fe; border:2px solid #38bdf8; border-radius:8px; padding:10px;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#0369a1;">ĐỘI 1 (LEFT)</div>
                            <div id="gd-team1" style="font-size:2rem; font-weight:900; color:#0284c7;">0</div>
                        </div>
                        <div style="font-size:2rem; font-weight:900; color:#94a3b8; padding:10px;">VS</div>
                        <div style="flex:1; background:#fce7f3; border:2px solid #f472b6; border-radius:8px; padding:10px;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#be185d;">ĐỘI 2 (RIGHT)</div>
                            <div id="gd-team2" style="font-size:2rem; font-weight:900; color:#db2777;">0</div>
                        </div>
                    </div>
                    <div style="margin-top:15px; text-align:center; background:#f0fdf4; padding:10px; border-radius:8px; border:2px dashed #22c55e;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#166534;">CHÊNH LỆCH NHỎ NHẤT (MIN DIFF)</div>
                        <div id="gd-res-min" style="font-size:2.5rem; font-weight:900; color:#15803d;">-</div>
                    </div>
                </div>
                <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; display:flex; flex-direction:column;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:5px;">NHẬT KÝ (LOG)</div>
                    <div id="gd-log" style="font-family: monospace; font-size: 0.85rem; color: #475569; overflow-y: auto; height: 160px; line-height: 1.6; background:white; padding:8px; border:1px solid #fde68a;"></div>
                </div>
            </div>
        </div>
    `;
}

function gd_log(msg, highlight = false) {
    const log = document.getElementById('gd-log');
    let fw = highlight ? "font-weight:bold; color:#ef4444;" : "";
    log.innerHTML += `<div style="border-bottom: 1px dashed #fef08a; padding: 4px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function gd_start() {
    const lines = document.getElementById('gd-input').value.trim().split('\n');
    clearInterval(window.gd_auto_timer);
    document.getElementById('btn-gd-auto').innerHTML = "▶ Tự động";
    window.gd_auto_timer = null;
    window.gd_mode = document.getElementById('gd-mode').value;

    try {
        const [N, Q] = lines[0].trim().split(/\s+/).map(Number);
        window.gd_N = N;
        window.gd_A = lines[1].trim().split(/\s+/).map(BigInt);
        
        window.gd_Queries = [];
        for (let i = 0; i < Q; i++) {
            let [u, v] = lines[2 + i].trim().split(/\s+/).map(Number);
            window.gd_Queries.push({u, v});
        }
        
        if (window.gd_A.length !== N || window.gd_Queries.length !== Q) throw new Error();
        if (N > 20) {
            alert("Để mô phỏng trực quan dễ nhìn, vui lòng nhập mảng N <= 20."); return;
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Xem lại format."); return;
    }

    // Tiền xử lý Prefix Sum
    window.gd_P = [0n];
    for(let i=0; i<window.gd_N; i++) {
        window.gd_P.push(window.gd_P[i] + window.gd_A[i]);
    }

    window.gd_curr_q = 0;
    document.getElementById('gd-log').innerHTML = "";
    document.getElementById('gd-target-box').style.display = "none";
    
    document.getElementById('btn-gd-step').disabled = false;
    document.getElementById('btn-gd-auto').disabled = false;
    
    gd_render_pref();
    gd_render_array(-1, -1, -1);
    
    window.gd_generator = logic_gd_main();
    gd_log(`Đã nạp mảng ${window.gd_N} phần tử. Khởi tạo Prefix Sum O(N).`, true);
}

function gd_render_pref(highlightIdx1 = -1, highlightIdx2 = -1) {
    const container = document.getElementById('gd-pref-container');
    let html = '';
    for(let i=0; i<=window.gd_N; i++) {
        let bg = "#f1f5f9", color="#64748b", border="1px solid #cbd5e1";
        if (i === highlightIdx1 || i === highlightIdx2) {
            bg = "#fef08a"; color="#a16207"; border="2px solid #eab308";
        }
        html += `<div style="padding:4px 8px; font-family:monospace; font-size:0.85rem; background:${bg}; color:${color}; border:${border}; border-radius:4px;">P[${i}]=${window.gd_P[i]}</div>`;
    }
    container.innerHTML = html;
}

function gd_render_array(u, v, splitK) {
    const container = document.getElementById('gd-array-container');
    let html = '';
    
    // Nếu u=-1, render nguyên mảng mờ
    for(let i=1; i<=window.gd_N; i++) {
        let val = window.gd_A[i-1];
        let bg = "#f8fafc", color="#cbd5e1", border="1px solid #e2e8f0";
        
        if (i >= u && i <= v) {
            if (i <= splitK) {
                bg = "#e0f2fe"; color="#0369a1"; border="2px solid #38bdf8"; // Trái (Xanh)
            } else {
                bg = "#fce7f3"; color="#be185d"; border="2px solid #f472b6"; // Phải (Hồng)
            }
        }
        
        let splitMarker = (i === splitK && i < v) ? `<div style="position:absolute; right:-6px; top:-5px; bottom:-5px; width:4px; background:#eab308; z-index:10; border-radius:2px;"></div>` : "";

        html += `
            <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:${bg}; color:${color}; border:${border}; border-radius:6px; font-weight:bold; font-family:monospace; font-size:1.1rem; transition:0.3s;">
                <span style="position:absolute; top:-15px; font-size:0.6rem; color:#94a3b8;">${i}</span>
                ${val}
                ${splitMarker}
            </div>
        `;
    }
    container.innerHTML = html;
}

function gd_update_score(L, R, minD) {
    document.getElementById('gd-team1').innerText = L.toString();
    document.getElementById('gd-team2').innerText = R.toString();
    document.getElementById('gd-res-min').innerText = minD !== -1n ? minD.toString() : "-";
}

function* logic_gd_main() {
    for (let q = 0; q < window.gd_Queries.length; q++) {
        let u = window.gd_Queries[q].u;
        let v = window.gd_Queries[q].v;
        
        gd_log(`\n--- TRUY VẤN ${q+1}: ĐOẠN [${u}, ${v}] ---`, true);
        
        if (u === v) {
            gd_log(`Đoạn chỉ có 1 phần tử, không thể chia đội! Bỏ qua.`);
            continue;
        }

        let S = window.gd_P[v] - window.gd_P[u-1];
        gd_render_pref(u-1, v);
        gd_log(`Tổng đoạn S = P[${v}] - P[${u-1}] = ${window.gd_P[v]} - ${window.gd_P[u-1]} = ${S}`);
        yield;

        let minDiff = -1n;

        if (window.gd_mode === 'sub2') {
            // O(N) Scan
            document.getElementById('gd-target-box').style.display = "none";
            for (let k = u; k < v; k++) {
                let L = window.gd_P[k] - window.gd_P[u-1];
                let R = S - L;
                let diff = L > R ? L - R : R - L; // abs BigInt
                
                if (minDiff === -1n || diff < minDiff) minDiff = diff;
                
                gd_render_array(u, v, k);
                gd_update_score(L, R, minDiff);
                gd_log(`Cắt tại k=${k}: Trái=${L}, Phải=${R} -> Độ lệch: ${diff}`);
                yield;
            }
        } else {
            // O(log N) Binary Search
            let targetNum = window.gd_P[v] + window.gd_P[u-1];
            let Target = targetNum / 2n; // integer division
            
            let tb = document.getElementById('gd-target-box');
            tb.style.display = "block";
            tb.innerText = `Target P[k] ≈ (P[v]+P[u-1])/2 = ${targetNum}/2 = ${Target}`;
            
            gd_log(`Cần tìm k sao cho L ≈ S/2 => P[k] ≈ Target = <b>${Target}</b>`);
            yield;

            // Simulate Lower Bound
            let low = u, high = v - 1, best_k = v - 1;
            while (low <= high) {
                let mid = Math.floor((low + high) / 2);
                if (window.gd_P[mid] >= Target) {
                    best_k = mid;
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            }
            
            gd_log(`Binary Search tìm được k = <b>${best_k}</b> (P[${best_k}] = ${window.gd_P[best_k]} >= ${Target})`);
            
            // Check best_k
            let candidates = [best_k];
            if (best_k - 1 >= u) candidates.push(best_k - 1);
            
            for (let k of candidates) {
                let L = window.gd_P[k] - window.gd_P[u-1];
                let R = S - L;
                let diff = L > R ? L - R : R - L;
                
                if (minDiff === -1n || diff < minDiff) minDiff = diff;
                
                gd_render_array(u, v, k);
                gd_update_score(L, R, minDiff);
                gd_log(`Thử ứng viên k = ${k}: Trái=${L}, Phải=${R} -> Lệch: ${diff}`, true);
                yield;
            }
        }
        
        gd_log(`=> KẾT LUẬN TRUY VẤN ${q+1}: Độ lệch nhỏ nhất = <b>${minDiff}</b>`, true);
        gd_render_pref(-1, -1);
        document.getElementById('gd-target-box').style.display = "none";
        yield;
    }

    gd_render_array(-1, -1, -1);
    gd_log(`\nHOÀN TẤT TẤT CẢ TRUY VẤN!`, true);
    finish_gd();
}

function finish_gd() {
    document.getElementById('btn-gd-step').disabled = true;
    document.getElementById('btn-gd-auto').disabled = true;
    gd_toggle_auto(true);
}

function gd_step() {
    if (window.gd_generator) window.gd_generator.next();
}

function gd_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-gd-auto');
    if (window.gd_auto_timer || forceStop) {
        clearInterval(window.gd_auto_timer);
        window.gd_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.gd_auto_timer = setInterval(() => {
            if(window.gd_generator) {
                let res = window.gd_generator.next();
                if(res.done) gd_toggle_auto(true);
            }
        }, 1200); 
    }
}