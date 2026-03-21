/**
 * FILE MÔ PHỎNG: TRÒ CHƠI LINEDASH
 * Tác giả: Gemini
 */

window.ld_N = 0;
window.ld_T = 0;
window.ld_Q = 0;
window.ld_Events = []; // [{t, cmd, v, p_dist}]
window.ld_Queries = [];
window.ld_curr_q = 0;
window.ld_generator = null;
window.ld_auto_timer = null;
window.ld_V_CHEO = Math.sqrt(2);

function init_hcm2526_lndash_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Truy vấn Quãng đường (Prefix Event Sum + Binary Search)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="ld-input" style="width: 150px; height: 130px; padding: 5px; font-family: monospace; font-size: 1rem; text-align:center;" placeholder="N T Q&#10;T1 C1&#10;...&#10;L1 R1...">3 5 2
1 /
3 -
4 \\
1 5
2 4</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <button onclick="ld_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu & Tiền xử lý</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="ld_step()" id="btn-ld-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Giải Truy vấn tiếp theo</button>
                        <button onclick="ld_toggle_auto()" id="btn-ld-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: stretch; gap: 10px; margin-top:5px;">
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px dashed #f59e0b; flex:1; text-align:center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#b45309; margin-bottom:5px;">GetDist(R)</div>
                            <div id="ld-dist-R" style="font-family:monospace; font-size:1.5rem; color:#92400e; font-weight:bold;">-</div>
                        </div>
                        <div style="background: #f1f5f9; padding: 10px; border-radius: 8px; border: 1px dashed #64748b; flex:1; text-align:center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#334155; margin-bottom:5px;">GetDist(L)</div>
                            <div id="ld-dist-L" style="font-family:monospace; font-size:1.5rem; color:#475569; font-weight:bold;">-</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 2px solid #22c55e; flex:1; text-align: center;">
                            <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">KẾT QUẢ ĐOẠN [L, R]</div>
                            <div id="ld-res-final" style="color:#15803d; font-size: 1.8rem; font-weight: 900; line-height: 1;">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 15px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x:auto;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px;">TRỤC THỜI GIAN VÀ CÁC MỐC SỰ KIỆN LỆNH</div>
                    <div id="ld-timeline-container" style="display: flex; gap: 5px; position:relative; padding-top:20px; padding-bottom:10px;"></div>
                </div>
            </div>

            <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; display:flex; flex-direction:column;">
                <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">NHẬT KÝ (LOG)</div>
                <div id="ld-log" style="font-family: monospace; font-size: 0.85rem; color: #334155; overflow-y: auto; height: 150px; line-height: 1.6; background:white; padding:8px; border:1px solid #e2e8f0;"></div>
            </div>
        </div>
    `;
}

function ld_log(msg, highlight = false) {
    const log = document.getElementById('ld-log');
    let fw = highlight ? "font-weight:bold; color:#0284c7;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #e2e8f0; padding: 4px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function ld_start() {
    const lines = document.getElementById('ld-input').value.trim().split('\n').filter(l => l.trim() !== "");
    clearInterval(window.ld_auto_timer);
    document.getElementById('btn-ld-auto').innerHTML = "▶ Tự động";
    window.ld_auto_timer = null;

    try {
        const [N, T, Q] = lines[0].trim().split(/\s+/).map(Number);
        window.ld_N = N; window.ld_T = T; window.ld_Q = Q;
        
        // Parse events
        let tempEvents = [];
        for (let i = 0; i < N; i++) {
            let parts = lines[1 + i].trim().split(/\s+/);
            tempEvents.push({t: Number(parts[0]), cmd: parts[1]});
        }
        // Always add a dummy event at t=0 if not present
        if (tempEvents.length === 0 || tempEvents[0].t !== 0) {
            tempEvents.unshift({t: 0, cmd: '-'});
        }
        
        // Calculate prefix distances
        window.ld_Events = [];
        let curr_dist = 0;
        let curr_v = 1; // '-'
        
        for (let i = 0; i < tempEvents.length; i++) {
            let ev = tempEvents[i];
            if (i > 0) {
                let dt = ev.t - window.ld_Events[i-1].t;
                curr_dist += dt * window.ld_Events[i-1].v;
            }
            let v = ev.cmd === '-' ? 1 : window.ld_V_CHEO;
            window.ld_Events.push({t: ev.t, cmd: ev.cmd, v: v, p_dist: curr_dist});
        }

        // Parse queries
        window.ld_Queries = [];
        for (let i = 0; i < Q; i++) {
            let [L, R] = lines[1 + N + i].trim().split(/\s+/).map(Number);
            window.ld_Queries.push({L, R});
        }
        
    } catch(e) {
        alert("Lỗi dữ liệu đầu vào. Vui lòng kiểm tra lại định dạng."); return;
    }

    document.getElementById('ld-dist-R').innerText = "-";
    document.getElementById('ld-dist-L').innerText = "-";
    document.getElementById('ld-res-final').innerText = "-";
    document.getElementById('ld-log').innerHTML = "";
    
    document.getElementById('btn-ld-step').disabled = false;
    document.getElementById('btn-ld-auto').disabled = false;
    
    ld_render_timeline(-1, -1);
    window.ld_generator = logic_ld_queries();
    
    ld_log(`Đã nạp xong ${window.ld_N} mốc lệnh. Xây dựng xong Mảng Cộng dồn Sự kiện P[i] O(N).`, true);
}

function ld_render_timeline(active_X, active_idx) {
    const container = document.getElementById('ld-timeline-container');
    let html = '';
    
    for (let i = 0; i < window.ld_Events.length; i++) {
        let ev = window.ld_Events[i];
        let next_t = (i === window.ld_Events.length - 1) ? window.ld_T : window.ld_Events[i+1].t;
        let width = Math.max(80, (next_t - ev.t) * 30); // Tùy chỉnh độ rộng
        if (width > 200) width = 200; // Cap
        
        let bg = ev.cmd === '-' ? "#e0f2fe" : "#fce7f3";
        let border = ev.cmd === '-' ? "#0284c7" : "#db2777";
        let speed_txt = ev.cmd === '-' ? "v=1" : "v=√2";
        let glow = i === active_idx ? "box-shadow: 0 0 10px #f59e0b; border: 2px solid #eab308;" : `border: 2px solid ${border};`;

        html += `
            <div style="min-width:${width}px; background:${bg}; ${glow} border-radius:4px; padding:5px; position:relative; display:flex; flex-direction:column; align-items:center; transition:0.3s;">
                <div style="position:absolute; top:-20px; left:0; font-size:0.75rem; font-weight:bold; color:#475569;">t=${ev.t}</div>
                <div style="font-family:monospace; font-weight:bold; color:${border};">${ev.cmd} (${speed_txt})</div>
                <div style="font-size:0.7rem; color:#64748b; margin-top:5px;">P=${ev.p_dist.toFixed(2)}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function getDist(X) {
    // Binary Search Upper Bound
    let low = 0, high = window.ld_Events.length - 1;
    let k = 0;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (window.ld_Events[mid].t <= X) {
            k = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    
    let ev = window.ld_Events[k];
    let dist = ev.p_dist + (X - ev.t) * ev.v;
    return {k, dist, ev};
}

function* logic_ld_queries() {
    for (let i = 0; i < window.ld_Queries.length; i++) {
        let L = window.ld_Queries[i].L;
        let R = window.ld_Queries[i].R;
        
        ld_log(`\n--- TRUY VẤN ${i+1}: Tính quãng đường đoạn [${L}, ${R}] ---`, true);
        
        // Tính GetDist(R)
        ld_log(`> 1. Tính GetDist(R = ${R}):`);
        let resR = getDist(R);
        ld_render_timeline(R, resR.k);
        ld_log(`   Dùng Nhị phân, phát hiện R=${R} rớt vào đoạn lệnh bắt đầu từ t=${resR.ev.t} (Lệnh '${resR.ev.cmd}').`);
        ld_log(`   GetDist(${R}) = P[${resR.k}] + V * (R - t) = ${resR.ev.p_dist.toFixed(4)} + ${resR.ev.v.toFixed(4)} * (${R} - ${resR.ev.t}) = <b>${resR.dist.toFixed(6)}</b>`);
        document.getElementById('ld-dist-R').innerText = resR.dist.toFixed(6);
        yield;

        // Tính GetDist(L)
        ld_log(`> 2. Tính GetDist(L = ${L}):`);
        let resL = getDist(L);
        ld_render_timeline(L, resL.k);
        ld_log(`   Dùng Nhị phân, phát hiện L=${L} rớt vào đoạn lệnh bắt đầu từ t=${resL.ev.t} (Lệnh '${resL.ev.cmd}').`);
        ld_log(`   GetDist(${L}) = P[${resL.k}] + V * (L - t) = ${resL.ev.p_dist.toFixed(4)} + ${resL.ev.v.toFixed(4)} * (${L} - ${resL.ev.t}) = <b>${resL.dist.toFixed(6)}</b>`);
        document.getElementById('ld-dist-L').innerText = resL.dist.toFixed(6);
        yield;

        // Kết quả
        let finalAns = resR.dist - resL.dist;
        document.getElementById('ld-res-final').innerText = finalAns.toFixed(6);
        ld_log(`=> Kết quả Truy vấn ${i+1}: GetDist(${R}) - GetDist(${L}) = <span style="color:#166534;">${finalAns.toFixed(6)}</span>`, true);
        yield;
    }

    ld_render_timeline(-1, -1);
    ld_log(`\nHOÀN TẤT TẤT CẢ TRUY VẤN!`, true);
    document.getElementById('btn-ld-step').disabled = true;
    document.getElementById('btn-ld-auto').disabled = true;
    ld_toggle_auto(true);
}

function ld_step() {
    if (window.ld_generator) window.ld_generator.next();
}

function ld_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-ld-auto');
    if (window.ld_auto_timer || forceStop) {
        clearInterval(window.ld_auto_timer);
        window.ld_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.ld_auto_timer = setInterval(() => {
            if(window.ld_generator) {
                let res = window.ld_generator.next();
                if(res.done) ld_toggle_auto(true);
            }
        }, 1500); // Tốc độ chạy auto
    }
}