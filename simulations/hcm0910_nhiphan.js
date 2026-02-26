/**
 * FILE MÔ PHỎNG: BÀI NHỊ PHÂN (HCM 2009-2010)
 * Tên hàm: init_hcm0910_nhiphan_simulation
 */

window.nhiphan_n1 = 0;
window.nhiphan_n2 = 0;
window.nhiphan_pos = 0;

function init_hcm0910_nhiphan_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-green">
            <div class="step-badge bg-green">Mô phỏng song song hai phương pháp nhị phân</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div class="input-group">
                    <b>Nhập N:</b> 
                    <input type="number" id="input-nhiphan-n" value="13" min="1" max="1000000" style="width: 100px; margin-left:10px;">
                </div>
                <button onclick="nhiphan_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Khởi tạo</button>
                <button onclick="nhiphan_nextStep()" id="btn-step-nhiphan" class="toggle-btn" style="background:#29c702; color:white;">⏭ Từng bước</button>
                <button onclick="nhiphan_reset()" class="toggle-btn" style="background:#64748b; color:white;">🔄 Reset</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #fdfaf6; padding: 15px; border-radius: 8px; border: 1px solid #eb9903;">
                    <h4 style="margin-top:0; color:#eb9903;">CÁCH 1: PHÉP CHIA (% 2)</h4>
                    <div id="bitDivContainer" style="display: flex; flex-direction: row-reverse; gap: 5px; margin-bottom: 15px; min-height: 60px; justify-content: center; flex-wrap: wrap;"></div>
                    <div id="logDiv" style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; height: 120px; overflow-y: auto;"></div>
                </div>

                <div style="background: #faf5ff; padding: 15px; border-radius: 8px; border: 1px solid #cd06df;">
                    <h4 style="margin-top:0; color:#cd06df;">CÁCH 2: XỬ LÝ BIT (& 1)</h4>
                    <div id="bitBitwiseContainer" style="display: flex; flex-direction: row-reverse; gap: 5px; margin-bottom: 15px; min-height: 60px; justify-content: center; flex-wrap: wrap;"></div>
                    <div id="logBit" style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; height: 120px; overflow-y: auto;"></div>
                </div>
            </div>
            
            <div id="nhiphan-final-msg" style="text-align: center; margin-top: 15px; font-weight: bold; color: #0c4a6e;"></div>
        </div>
    `;
    nhiphan_init();
}

function nhiphan_log(id, msg, color = "#d4d4d4") {
    const logArea = document.getElementById(id);
    if (logArea) {
        logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function nhiphan_addBox(containerId, val, pos) {
    const container = document.getElementById(containerId);
    const box = document.createElement('div');
    box.style = `
        width: 35px; height: 50px; border: 2px solid ${val === 1 ? '#29c702' : '#cbd5e1'};
        background: ${val === 1 ? '#f0fdf4' : 'white'};
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        border-radius: 4px; font-weight: bold;
    `;
    box.innerHTML = `<div>${val}</div><div style="font-size:0.65rem; color:#0284c7;">${pos}</div>`;
    container.appendChild(box);
}

function nhiphan_init() {
    const val = parseInt(document.getElementById('input-nhiphan-n').value) || 0;
    window.nhiphan_n1 = val;
    window.nhiphan_n2 = val;
    window.nhiphan_pos = 0;
    
    document.getElementById('bitDivContainer').innerHTML = "";
    document.getElementById('bitBitwiseContainer').innerHTML = "";
    document.getElementById('logDiv').innerHTML = "";
    document.getElementById('logBit').innerHTML = "";
    document.getElementById('nhiphan-final-msg').innerText = "";
    document.getElementById('btn-step-nhiphan').disabled = false;

    nhiphan_log('logDiv', `Khởi tạo N = ${val}`, "#f59e0b");
    nhiphan_log('logBit', `Khởi tạo N = ${val}`, "#f59e0b");
}

function nhiphan_nextStep() {
    if (window.nhiphan_n1 <= 0 && window.nhiphan_n2 <= 0) {
        document.getElementById('btn-step-nhiphan').disabled = true;
        return;
    }

    const p = window.nhiphan_pos;

    if (window.nhiphan_n1 > 0) {
        let rem = window.nhiphan_n1 % 2;
        nhiphan_addBox('bitDivContainer', rem, p);
        nhiphan_log('logDiv', `Vị trí ${p}: dư ${rem}. N tiếp theo = ${Math.floor(window.nhiphan_n1/2)}`, rem === 1 ? "#5ee727" : "#94a3b8");
        window.nhiphan_n1 = Math.floor(window.nhiphan_n1 / 2);
    }

    if (window.nhiphan_n2 > 0) {
        let bit = window.nhiphan_n2 & 1;
        nhiphan_addBox('bitBitwiseContainer', bit, p);
        nhiphan_log('logBit', `Vị trí ${p}: bit là ${bit}. N tiếp theo = ${window.nhiphan_n2 >> 1}`, bit === 1 ? "#5ee727" : "#94a3b8");
        window.nhiphan_n2 = window.nhiphan_n2 >> 1;
    }

    window.nhiphan_pos++;
    
    if (window.nhiphan_n1 <= 0 && window.nhiphan_n2 <= 0) {
        document.getElementById('btn-step-nhiphan').disabled = true;
        document.getElementById('nhiphan-final-msg').innerText = "Hoàn thành mô phỏng!";
    }
}

function nhiphan_reset() {
    nhiphan_init();
}