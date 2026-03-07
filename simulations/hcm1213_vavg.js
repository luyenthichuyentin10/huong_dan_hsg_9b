/**
 * FILE MÔ PHỎNG: ROBOT VAVG (HCM 2012-2013)
 * Logic: Vtb = Tổng S / Tổng T
 */

window.vavg_robot = {
    x: 0, y: 0,
    dir: 0, // 0: Đông (+x), 1: Nam (-y), 2: Tây (-x), 3: Bắc (+y)
    totalS: 0,
    totalT: 0,
    commands: [],
    stepIdx: 0
};

function init_hcm1213_vavg_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Robot RXT</div>
            
            <div style="margin-bottom: 15px;">
                <textarea id="vavg-input" style="width:100%; height:100px; font-family:monospace; padding:10px; border:1px solid #cbd5e1; border-radius:4px;" 
                placeholder="Nhập lệnh (Ví dụ):&#10;F 7 5&#10;R 8 6&#10;F 3 1&#10;L 9 5"></textarea>
                <div style="margin-top:10px; display:flex; gap:10px;">
                    <button onclick="vavg_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Khởi tạo</button>
                    <button onclick="vavg_step()" id="btn-vavg-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
                <div id="vavg-canvas" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; height: 320px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <div style="position: absolute; width:100%; height:100%; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;"></div>
                    <div id="robot-icon" style="position: absolute; font-size: 1.5rem; transition: all 0.4s; z-index: 2;">🤖</div>
                    <svg id="vavg-path" style="position:absolute; top:0; left:0; width:100%; height:100%;"></svg>
                </div>

                <div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">
                    <div style="color:#fbbf24; font-weight:bold; margin-bottom:10px; border-bottom:1px solid #444;">DỮ LIỆU HÀNH TRÌNH</div>
                    <p>Tổng quãng đường: <span id="st-s" style="color:#ff4d4d">0</span> cm</p>
                    <p>Tổng thời gian: <span id="st-t" style="color:#ff4d4d">0</span> s</p>
                    <hr style="border:0; border-top:1px solid #333;">
                    <div id="st-log" style="height: 120px; overflow-y: auto; font-size: 0.8rem;">> Chờ nhập lệnh...</div>
                    <div id="st-res" style="margin-top:10px; font-size: 1.1rem; font-weight:bold; color:#5ee727;"></div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('vavg-input').value = "F 70 5\nR 80 6\nF 30 1\nL 90 5";
}

function vavg_init() {
    const text = document.getElementById('vavg-input').value.trim();
    if (!text) return;

    window.vavg_robot = {
        x: 0, y: 0, dir: 0, totalS: 0, totalT: 0,
        commands: text.split('\n').map(line => {
            const p = line.split(/\s+/);
            return { type: p[0].toUpperCase(), k: parseInt(p[1]), t: parseInt(p[2]) };
        }),
        stepIdx: 0
    };

    document.getElementById('vavg-path').innerHTML = "";
    document.getElementById('st-log').innerHTML = "> Đã sẵn sàng.<br>";
    document.getElementById('st-res').innerHTML = "";
    document.getElementById('btn-vavg-step').disabled = false;
    vavg_update_ui();
}

function vavg_update_ui() {
    const r = window.vavg_robot;
    const icon = document.getElementById('robot-icon');
    
    // Scale 1 đơn vị = 1px để vẽ, tọa độ (0,0) nằm giữa canvas
    icon.style.left = `calc(50% + ${r.x}px)`;
    icon.style.top = `calc(50% - ${r.y}px)`;
    
    // Quay robot theo hướng
    const angles = [0, 90, 180, 270];
    icon.style.transform = `translate(-50%, -50%) rotate(${angles[r.dir]}deg)`;

    document.getElementById('st-s').innerText = r.totalS;
    document.getElementById('st-t').innerText = r.totalT;
}

function vavg_step() {
    const r = window.vavg_robot;
    if (r.stepIdx >= r.commands.length) {
        const vtb = r.totalS / r.totalT;
        document.getElementById('st-res').innerHTML = `Vận tốc TB = ${vtb.toFixed(2)}`;
        document.getElementById('btn-vavg-step').disabled = true;
        return;
    }

    const cmd = r.commands[r.stepIdx];
    const oldX = r.x;
    const oldY = r.y;

    // Cập nhật hướng
    if (cmd.type === 'R') r.dir = (r.dir + 1) % 4;
    else if (cmd.type === 'L') r.dir = (r.dir + 3) % 4;

    // Di chuyển
    if (r.dir === 0) r.x += cmd.k;      // Đông
    else if (r.dir === 1) r.y -= cmd.k; // Nam
    else if (r.dir === 2) r.x -= cmd.k; // Tây
    else if (r.dir === 3) r.y += cmd.k; // Bắc

    r.totalS += cmd.k;
    r.totalT += cmd.t;

    // Vẽ vết di chuyển
    const svg = document.getElementById('vavg-path');
    const cx = svg.clientWidth / 2;
    const cy = svg.clientHeight / 2;
    svg.innerHTML += `<line x1="${cx + oldX}" y1="${cy - oldY}" x2="${cx + r.x}" y2="${cy - r.y}" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />`;

    document.getElementById('st-log').innerHTML += `> Lệnh ${r.stepIdx+1}: ${cmd.type} đi ${cmd.k}, mất ${cmd.t}s<br>`;
    r.stepIdx++;
    vavg_update_ui();
}