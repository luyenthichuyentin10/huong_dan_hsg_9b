## 📊 Bài 3: Số SDigit (HCM 2023-2024)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

**Định nghĩa:** Số SDigit là số có tổng các chữ số là một số nguyên tố.

**Yêu cầu:** Đếm xem có bao nhiêu số SDigit có độ dài từ $l$ đến $r$ (nghĩa là số có $l$ chữ số, $l+1$ chữ số, ..., $r$ chữ số). Kết quả chia lấy dư cho $10^9 + 7$.

**Nhận xét:**
- Số có độ dài $k$ bắt đầu từ $10^{k-1}$ đến $10^k - 1$. (Ví dụ độ dài 2 là từ $10$ đến $99$).
- Số nguyên không có chữ số $0$ đứng đầu. Do đó, chữ số đầu tiên phải từ $1$ đến $9$. Các chữ số sau từ $0$ đến $9$.
<div class="important-note">

**📌 Dạng bài:** DP digit - Prefix sum
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Subtask 1 & 2: r ≤ 6)</div>

### 💡 Ý tưởng Subtask 1 & 2
Với 80% số điểm, giới hạn lớn nhất là $r \le 6$. Số lớn nhất có 6 chữ số là $999,999$.
Ta hoàn toàn có thể dùng vòng lặp duyệt qua mọi số từ $10^{l-1}$ đến $10^r - 1$. 
Với mỗi số, ta tách các chữ số, tính tổng, và kiểm tra xem tổng đó có phải là số nguyên tố hay không.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">La_So_Nguyen_To</span>(<span class="var">x</span>):
    <span class="kw">NẾU</span> (<span class="var">x</span> < <span class="val">2</span>) <span class="kw">TRẢ VỀ SAI</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">2</span> <span class="kw">ĐẾN</span> <span class="fn">Căn_Bậc_Hai</span>(<span class="var">x</span>):
        <span class="kw">NẾU</span> (<span class="var">x</span> % <span class="var">i</span> == <span class="val">0</span>) <span class="kw">TRẢ VỀ SAI</span>
    <span class="kw">TRẢ VỀ ĐÚNG</span>

<span class="kw">HÀM</span> <span class="fn">Tinh_Tong_Chu_So</span>(<span class="var">n</span>):
    <span class="var">tong</span> = <span class="val">0</span>
    <span class="kw">LẶP TRONG KHI</span> (<span class="var">n</span> > <span class="val">0</span>):
        <span class="var">tong</span> = <span class="var">tong</span> + (<span class="var">n</span> % <span class="val">10</span>)
        <span class="var">n</span> = <span class="var">n</span> / <span class="val">10</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">tong</span>

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="var">Dem</span> = <span class="val">0</span>
<span class="var">Bat_Dau</span> = <span class="val">10</span>^(<span class="var">l</span> - <span class="val">1</span>)
<span class="var">Ket_Thuc</span> = <span class="val">10</span>^<span class="var">r</span> - <span class="val">1</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">Bat_Dau</span> <span class="kw">ĐẾN</span> <span class="var">Ket_Thuc</span>:
    <span class="var">Tong</span> = <span class="fn">Tinh_Tong_Chu_So</span>(<span class="var">i</span>)
    <span class="kw">NẾU</span> (<span class="fn">La_So_Nguyen_To</span>(<span class="var">Tong</span>)) <span class="kw">THÌ</span>:
        <span class="var">Dem</span> = (<span class="var">Dem</span> + <span class="val">1</span>) % <span class="var">MOD</span>
<span class="kw">XUẤT</span> <span class="var">Dem</span>
</pre>
**Đánh giá:** Cách này chạy mất khoảng $10^6$ phép tính. Chạy cực nhanh và ăn trọn 80% điểm. Tuy nhiên với $r=250$, vòng lặp $10^{250}$ là bất khả thi!
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Quy hoạch động chữ số - Digit DP (Subtask 3: r ≤ 250)</div>

Khi không thể duyệt từng con số, ta sẽ duyệt **"Cách ghép các chữ số"**.

### 💡 Ý tưởng Tối ưu: Lập bảng DP
Gọi $DP[i][s]$ là số lượng chuỗi gồm $i$ chữ số (được phép có số 0 ở đầu) sao cho tổng các chữ số bằng $s$.
- **Cơ sở quy hoạch động:** Chuỗi độ dài 0, tổng 0 có 1 cách duy nhất $\rightarrow DP[0][0] = 1$.
- **Chuyển trạng thái:** Chuỗi độ dài $i$ có tổng $s$ được tạo ra bằng cách lấy một chuỗi độ dài $i-1$ có tổng $j$, rồi ghép thêm 1 chữ số $d$ vào. Khi đó $s = j + d \Rightarrow j = s - d$.
Vì chữ số $d$ chỉ nằm trong khoảng từ $0$ đến $9$, nên $j$ nằm trong khoảng từ $s - 9$ đến $s$.
- **Công thức:**  $$DP[i][s] = \sum_{d=0}^{9} DP[i-1][s - d] \pmod{10^9+7}$$

### 🔍 Giải thích chi tiết ví dụ DP[3][22]
**Ý nghĩa của DP[3][22]:** `DP[3][22]` lưu số lượng các chuỗi có độ dài $3$ chữ số (từ 000 đến 999) sao cho tổng các chữ số bằng chính xác $22$.

**Phân tích công thức truy hồi:** 
- Theo thuật toán: Để tạo ra chuỗi **3** chữ số có tổng **22**, ta lấy một chuỗi **2** chữ số (có tổng là $j$), rồi ghép thêm chữ số thứ ba (gọi là $d$) vào cuối.
$$\Rightarrow s = j + d \implies j = s - d$$
- Vì chữ số $d$ chỉ có giá trị từ **0** đến **9**, nên tổng **j** của **2** chữ số đầu tiên sẽ nằm trong khoảng:
$$j = 22 - d \implies j \in [22 - 9, 22 - 0] = [13, 22]$$

**Khám phá sự giới hạn (Cận trên):** 
- Mặc dù công thức toán học cho phép **j** chạy lên tới **22**, nhưng ta biết rằng tổng lớn nhất của **2** chữ số chỉ là **18** (khi chuỗi là 99).
- Do đó, các trạng thái $DP[2][19], DP[2][20], DP[2][21], DP[2][22]$ đều bằng 0 (không tồn tại).
- Giới hạn `bd = max(0, s - 9)` đã xử lý mượt mà việc này, chỉ cộng dồn từ `j = 13` đến `j = 18`.

**Bóc tách từng trường hợp để cộng dồn:** Ta sẽ tính `DP[3][22]` bằng cách lấy tổng của **6** trường hợp sau:
- **Trường hợp 1 (Chọn $d=9$):** Cần phần trước dài 2 có tổng $13 \rightarrow$ Lấy `DP[2][13]`.
    - Có 6 chuỗi: `49, 58, 67, 76, 85, 94`. Ghép thêm số `9` ta được: `499, 589, 679, 769, 859, 949`.
- **Trường hợp 2 (Chọn $d=8$):** Cần phần trước dài 2 có tổng $14 \rightarrow$ Lấy `DP[2][14]`.
    - Có 5 chuỗi: `59, 68, 77, 86, 95`. Ghép thêm số `8` ta được: `598, 688, 778, 868, 958`.
- **Trường hợp 3 (Chọn $d=7$):** Cần phần trước dài 2 có tổng $15 \rightarrow$ Lấy `DP[2][15]`.
    - Có 4 chuỗi: `69, 78, 87, 96`. Ghép thêm số `7` ta được: `697, 787, 877, 967`.
- **Trường hợp 4 (Chọn $d=6$):** Cần phần trước dài 2 có tổng $16 \rightarrow$ Lấy `DP[2][16]`.
    - Có 3 chuỗi: `79, 88, 97`. Ghép thêm số `6` ta được: `796, 886, 976`.
- **Trường hợp 5 (Chọn $d=5$):** Cần phần trước dài 2 có tổng $17 \rightarrow$ Lấy `DP[2][17]`.
    - Có 2 chuỗi: `89, 98`. Ghép thêm số `5` ta được: `895, 985`.
- **Trường hợp 6 (Chọn $d=4$):** Cần phần trước dài 2 có tổng $18 \rightarrow$ `Lấy DP[2][18]`.
    - Có 1 chuỗi: `99`. Ghép thêm số `4` ta được: `994`.

*(Nếu chọn $d \le 3$, ta cần phần trước có tổng $\ge 19$, điều này là không thể nên số cách ghép = 0)*.

**Kết luận:** Hệ thống DP sẽ thực hiện phép cộng tự động từ mảng đã lưu trước đó:

`DP[3][22] = DP[2][13] + DP[2][14] + DP[2][15] + DP[2][16] + DP[2][17] + DP[2][18]DP[3][22]` = $6 + 5 + 4 + 3 + 2 + 1 = \mathbf{21}$ cách.

### 🔑 Bước ngoặt: Mảng KQ và Kỹ thuật đếm dồn (Prefix Sum)
- Vì việc thêm số `0` ở đầu không làm thay đổi tổng chữ số, nên việc đếm các chuỗi độ dài $i$ **đã tự động bao hàm tất cả các con số có độ dài nhỏ hơn $i$**.
- $\Rightarrow$ Nếu ta gọi $KQ[i]$ là tổng tất cả các $DP[i][s]$ với $s$ là số nguyên tố, thì **$KQ[i]$ chính là tổng số lượng SDigit từ $1$ đến $10^i - 1$**!
- Để tìm số SDigit có độ dài từ $l$ đến $r$ (nghĩa là nằm trong khoảng $[10^{l-1}, 10^r - 1]$), ta chỉ việc dùng phép trừ mảng cộng dồn: 
**$$\text{Đáp án} = KQ[r] - KQ[l-1]$$**

<pre class="pseudocode">
<span class="var">MOD</span> = <span class="val">1000000007</span>
<span class="var">P</span> = <span class="fn">Sang_Nguyen_To</span>(<span class="val">2500</span>) <span class="com">// Tiền xử lý số nguyên tố (0: Là SNT, 1: Không phải)</span>
<span class="var">DP</span> = <span class="fn">MaTran</span>(<span class="val">255</span>, <span class="val">3000</span>, <span class="val">0</span>)
<span class="var">KQ</span> = <span class="fn">Mang</span>(<span class="val">255</span>, <span class="val">0</span>)

<span class="com">// Lập bảng DP toàn cục một lần duy nhất</span>
<span class="var">DP</span>[<span class="val">0</span>][<span class="val">0</span>] = <span class="val">1</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="val">251</span>:
    <span class="var">DP</span>[<span class="var">i</span>][<span class="val">0</span>] = <span class="val">1</span>
    <span class="kw">LẶP</span> <span class="var">s</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">i</span> * <span class="val">9</span>:
        <span class="var">bd</span> = <span class="fn">MAX</span>(<span class="val">0</span>, <span class="var">s</span> - <span class="val">9</span>)
        <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="var">s</span> <span class="kw">GIẢM VỀ</span> <span class="var">bd</span>:
            <span class="var">DP</span>[<span class="var">i</span>][<span class="var">s</span>] = (<span class="var">DP</span>[<span class="var">i</span>][<span class="var">s</span>] + <span class="var">DP</span>[<span class="var">i</span>-<span class="val">1</span>][<span class="var">j</span>]) % <span class="var">MOD</span>
            
        <span class="com">// Cập nhật mảng KQ nếu tổng s là số nguyên tố</span>
        <span class="kw">NẾU</span> (<span class="var">P</span>[<span class="var">s</span>] == <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">s</span> > <span class="val">1</span>) <span class="kw">THÌ</span>:
            <span class="var">KQ</span>[<span class="var">i</span>] = (<span class="var">KQ</span>[<span class="var">i</span>] + <span class="var">DP</span>[<span class="var">i</span>][<span class="var">s</span>]) % <span class="var">MOD</span>

<span class="com">// Trả lời Q truy vấn trong O(1)</span>
<span class="kw">NHẬP</span> <span class="var">Q</span>
<span class="kw">LẶP</span> <span class="var">q</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">Q</span>:
    <span class="kw">NHẬP</span> <span class="var">l</span>, <span class="var">r</span>
    <span class="var">Ans</span> = (<span class="var">KQ</span>[<span class="var">r</span>] - <span class="var">KQ</span>[<span class="var">l</span>-<span class="val">1</span>] + <span class="var">MOD</span>) % <span class="var">MOD</span>
    <span class="kw">XUẤT</span> <span class="var">Ans</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: So sánh thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 25%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 35%;">Vét cạn vòng lặp</th>
                    <th class="th-green" style="width: 40%;">Quy hoạch động chữ số</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng</td>
                    <td>Duyệt từng con số cụ thể, tách chữ số để tính tổng.</td>
                    <td>Duyệt cách "xếp gạch" tạo ra các đoạn đuôi có tổng theo ý muốn.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp</td>
                    <td>$O(10^r \times r)$ (Cấp số mũ)</td>
                    <td>$O(r \times \text{MaxSum} \times 10) \approx O(r^2 \times 90)$</td>
                </tr>
                <tr>
                    <td class="td-label">Với $r = 250$</td>
                    <td>Máy tính lượng tử cũng không chạy nổi.</td>
                    <td>Chạy tốn khoảng $5 \times 10^6$ phép tính (0.01 giây). 100% Điểm.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>