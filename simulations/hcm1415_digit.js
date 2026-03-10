/**
 * FILE MÔ PHỎNG: ĐỔI SỐ (DIGIT - HCM 14-15)
 */

window.digit_s2 = "";
window.digit_s3 = "";
window.digit_mode = "binary"; 
window.digit_generator = null;

function init_hcm1415_digit_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Tìm Số Lỗi (DIGIT)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>Chuỗi Hệ 2: <input type="text" id="digit-s2" value="1010" style="width:100px; padding:4px;"></div>
                <div>Chuỗi Hệ 3: <input type="text" id="digit-s3" value="212" style="width:100px; padding:4px;"></div>
                <select id="digit-mode" onchange="digit_switch_mode()" style="padding:5px; border-radius:4px;">
                    <option value="binary">Cách 2: Sinh tập hợp & Tìm nhị phân</option>
                    <option value="vetcan">Cách 1: Vét cạn (Brute Force)</option>
                </select>
                <button onclick="digit_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Khởi tạo</button>
                <button onclick="digit_step()" id="btn-digit-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp</button>
            </div>

            <div id="digit-workspace" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div id="digit-left-panel" style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;"></div>
                <div id="digit-right-panel" style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;"></div>
            </div>

            <div style="margin-top:15px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 15px;">
                <div id="digit-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem;">
                    > Nhập chuỗi và nhấn Khởi tạo...
                </div>
                <div style="background: #ecfdf5; padding: 12px; border-radius: 8px; border: 1px solid #a7f3d0; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#065f46;">KẾT QUẢ SỐ N (HỆ 10)</div>
                    <div id="digit-res" style="color:#059669; font-size: 2.5rem; font-weight: 900;">?</div>
                </div>
            </div>
        </div>
    `;
    digit_switch_mode();
}

function digit_switch_mode() {
    window.digit_mode = document.getElementById('digit-mode').value;
    const left = document.getElementById('digit-left-panel');
    const right = document.getElementById('digit-right-panel');
    
    if (window.digit_mode === 'vetcan') {
        left.innerHTML = `<div style="font-weight:bold; color:#64748b;">Số N Đang Xét</div><div id="vc-n" style="font-size:3rem; text-align:center; margin-top:20px;">-</div>`;
        right.innerHTML = `
            <div style="font-weight:bold; color:#64748b;">Chuyển đổi</div>
            <p style="margin-top:10px;">Hệ 2: <span id="vc-s2" style="font-family:monospace; font-size:1.2rem; background:#f1f5f9; padding:2px 5px;">-</span> (Lỗi: <b id="vc-e2" style="color:red">-</b>)</p>
            <p>Hệ 3: <span id="vc-s3" style="font-family:monospace; font-size:1.2rem; background:#f1f5f9; padding:2px 5px;">-</span> (Lỗi: <b id="vc-e3" style="color:red">-</b>)</p>
        `;
    } else {
        left.innerHTML = `<div style="font-weight:bold; color:#64748b;">Mảng M2 (Sinh từ Hệ 2)</div><div id="bs-m2" style="max-height:180px; overflow-y:auto; font-family:monospace; margin-top:10px;"></div>`;
        right.innerHTML = `<div style="font-weight:bold; color:#64748b;">Mảng M3 (Sinh từ Hệ 3 - Đã sắp xếp)</div><div id="bs-m3" style="max-height:180px; overflow-y:auto; font-family:monospace; margin-top:10px;"></div>`;
    }
}

function digit_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('digit-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

// Các hàm xử lý hệ cơ số bằng BigInt
function anyToDec(str, base) {
    let res = 0n;
    let b = BigInt(base);
    for (let i = 0; i < str.length; i++) {
        res = res * b + BigInt(str[i]);
    }
    return res;
}

function decToAny(num, base) {
    if (num === 0n) return "0";
    let res = "";
    let b = BigInt(base);
    while (num > 0n) {
        res = (num % b).toString() + res;
        num = num / b;
    }
    return res;
}

function diffCount(s1, s2) {
    if (s1.length !== s2.length) return 999;
    let c = 0;
    for (let i = 0; i < s1.length; i++) {
        if (s1[i] !== s2[i]) c++;
    }
    return c;
}

function digit_start() {
    window.digit_s2 = document.getElementById('digit-s2').value.trim();
    window.digit_s3 = document.getElementById('digit-s3').value.trim();
    document.getElementById('digit-res').innerText = "?";
    document.getElementById('digit-log').innerHTML = "";
    
    if (window.digit_mode === 'vetcan') {
        window.digit_generator = digit_logic_vetcan();
    } else {
        window.digit_generator = digit_logic_binary();
    }
    document.getElementById('btn-digit-step').disabled = false;
    digit_step();
}

// LOGIC CÁCH 1: VÉT CẠN
function* digit_logic_vetcan() {
    const s2 = window.digit_s2;
    const s3 = window.digit_s3;
    
    // Tính khoảng giá trị đơn giản (chỉ minh họa, thực tế lấy lũy thừa độ dài chuỗi)
    let minn = anyToDec("1" + "0".repeat(s2.length - 1), 2);
    let maxx = anyToDec("1".repeat(s2.length), 2);
    
    digit_log(`Vét cạn N từ ${minn} đến ${maxx}...`, "#38bdf8");

    for (let i = minn; i <= maxx; i++) {
        document.getElementById('vc-n').innerText = i.toString();
        
        let st2 = decToAny(i, 2);
        let st3 = decToAny(i, 3);
        
        let e2 = diffCount(s2, st2);
        let e3 = diffCount(s3, st3);
        
        document.getElementById('vc-s2').innerText = st2;
        document.getElementById('vc-s3').innerText = st3;
        document.getElementById('vc-e2').innerText = e2;
        document.getElementById('vc-e3').innerText = e3;

        if (e2 === 1 && e3 === 1) {
            digit_log(`N = ${i}: Sai lệch Hệ 2 là ${e2}, Hệ 3 là ${e3} -> KHỚP!`, "#10b981");
            document.getElementById('digit-res').innerText = i.toString();
            break;
        } else {
            digit_log(`N = ${i}: Sai lệch Hệ 2 là ${e2}, Hệ 3 là ${e3} -> Bỏ qua.`);
        }
        yield;
    }
    digit_log("HOÀN THÀNH VÉT CẠN", "#fbbf24");
}

// LOGIC CÁCH 2: SINH TẬP HỢP VÀ TÌM NHỊ PHÂN
function* digit_logic_binary() {
    const s2 = window.digit_s2;
    const s3 = window.digit_s3;
    let m2 = [];
    let m3 = [];

    // Sinh M2
    digit_log("Bước 1: Sinh các khả năng của Hệ 2...", "#38bdf8");
    for (let i = 0; i < s2.length; i++) {
        for (let j of ['0', '1']) {
            if (s2[i] !== j) {
                let temp = s2.substring(0, i) + j + s2.substring(i + 1);
                let val = anyToDec(temp, 2);
                m2.push({ str: temp, val: val });
            }
        }
    }
    document.getElementById('bs-m2').innerHTML = m2.map(x => `<div>${x.str} -> <b>${x.val}</b></div>`).join('');
    yield;

    // Sinh M3
    digit_log("Bước 2: Sinh các khả năng của Hệ 3...", "#38bdf8");
    for (let i = 0; i < s3.length; i++) {
        for (let j of ['0', '1', '2']) {
            if (s3[i] !== j) {
                let temp = s3.substring(0, i) + j + s3.substring(i + 1);
                let val = anyToDec(temp, 3);
                m3.push({ str: temp, val: val });
            }
        }
    }
    // Sắp xếp M3 theo giá trị
    m3.sort((a, b) => (a.val < b.val ? -1 : a.val > b.val ? 1 : 0));
    document.getElementById('bs-m3').innerHTML = m3.map(x => `<div>${x.str} -> <b>${x.val}</b></div>`).join('');
    yield;

    // Tìm kiếm nhị phân
    digit_log("Bước 3: Tìm kiếm nhị phân từng phần tử M2 trong M3...", "#fbbf24");
    for (let i = 0; i < m2.length; i++) {
        let target = m2[i].val;
        digit_log(`Đang tìm ${target}...`);
        
        let l = 0, r = m3.length - 1;
        let found = false;
        
        while (l <= r) {
            let mid = Math.floor((l + r) / 2);
            if (m3[mid].val === target) {
                found = true;
                break;
            }
            if (target < m3[mid].val) r = mid - 1;
            else l = mid + 1;
        }

        if (found) {
            digit_log(`=> ĐÃ TÌM THẤY! Số chung là ${target}`, "#10b981");
            document.getElementById('digit-res').innerText = target.toString();
            break;
        }
        yield;
    }
    digit_log("HOÀN THÀNH TÌM KIẾM NHỊ PHÂN", "#fbbf24");
}

function digit_step() {
    if (window.digit_generator) {
        let res = window.digit_generator.next();
        if (res.done) document.getElementById('btn-digit-step').disabled = true;
    }
}