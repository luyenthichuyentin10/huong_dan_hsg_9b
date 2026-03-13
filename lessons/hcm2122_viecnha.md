## 🏠 Bài 2: Làm việc nhà (VIECNHA - HCM 2021-2022)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Bình có một quỹ thời gian $T$ ($0 \le T \le 10^9$).
Có $C$ công việc nhà ($0 \le C \le 100$), mỗi việc tốn một lượng thời gian nhất định (tối đa $10^9$).

**Yêu cầu:** Tìm số lượng công việc **nhiều nhất** Bình có thể hoàn thành mà không vượt quá quỹ thời gian $T$.
<div class="important-note">

**📌 Dạng bài:** Tham lam
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp: Sắp xếp & Tham lam (Sorting + Greedy)</div>

### 💡 Ý tưởng Tối ưu
Bài toán này thuộc dạng **Tham lam (Greedy)** kinh điển. 
Mục tiêu của chúng ta là tối đa hóa *số lượng* công việc chứ không quan tâm công việc đó là gì. Do đó, để nhét được nhiều công việc nhất vào quỹ thời gian $T$, nguyên tắc duy nhất là: **Luôn chọn công việc tốn ít thời gian nhất để làm trước.**

**Các bước thực hiện:**
1. Gom thời gian của tất cả $C$ công việc vào một mảng $A$.
2. **Sắp xếp** mảng $A$ theo thứ tự tăng dần.
3. Dùng một biến `tong_thoi_gian` = 0 và biến đếm `dem` = 0.
4. Duyệt qua mảng $A$ đã sắp xếp. Cộng dồn thời gian từng việc vào `tong_thoi_gian`.
   - Nếu `tong_thoi_gian` $\le T$: Tăng `dem` lên 1.
   - Nếu `tong_thoi_gian` $> T$: Dừng ngay lập tức! Vì việc hiện tại đã vượt quá thời gian thì các việc phía sau (tốn nhiều thời gian hơn) chắc chắn cũng sẽ vượt quá.

**⚠️ Lưu ý kiểu dữ liệu:** Vì $C \le 100$ và mỗi việc có thể tốn $10^9$, tổng thời gian Bình cần có thể lên tới $100 \times 10^9 = 10^{11}$. Con số này vượt quá giới hạn của kiểu số nguyên 32-bit (`int`). Phải sử dụng kiểu 64-bit (`long long` trong C++) cho biến $T$ và `tong_thoi_gian`.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="com">// Sử dụng kiểu 64-bit để tránh tràn số</span>
<span class="kw">NHẬP</span> <span class="var">T</span>, <span class="var">C</span>
<span class="var">A</span> = <span class="fn">Mang</span>(<span class="var">C</span>)

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="var">C</span> - <span class="val">1</span>:
    <span class="kw">NHẬP</span> <span class="var">A</span>[<span class="var">i</span>]

<span class="com">// Bước then chốt: Sắp xếp tăng dần</span>
<span class="fn">Sap_Xep_Tang_Dan</span>(<span class="var">A</span>)

<span class="var">tong_thoi_gian</span> = <span class="val">0</span>
<span class="var">so_viec_da_lam</span> = <span class="val">0</span>

<span class="kw">LẶP MỖI</span> <span class="var">thoi_gian_viec</span> <span class="kw">TRONG</span> <span class="var">A</span>:
    <span class="kw">NẾU</span> (<span class="var">tong_thoi_gian</span> + <span class="var">thoi_gian_viec</span> ≤ <span class="var">T</span>) <span class="kw">THÌ</span>:
        <span class="var">tong_thoi_gian</span> = <span class="var">tong_thoi_gian</span> + <span class="var">thoi_gian_viec</span>
        <span class="var">so_viec_da_lam</span> = <span class="var">so_viec_da_lam</span> + <span class="val">1</span>
    <span class="kw">NGƯỢC LẠI</span>:
        <span class="kw">THOÁT_LẶP</span> <span class="com">// Hết thời gian</span>

<span class="kw">XUẤT</span> <span class="var">so_viec_da_lam</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Tham lam (Sắp xếp tăng dần)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(C \log C)$ do thao tác sắp xếp mảng. Với $C \le 100$, thao tác này chạy gần như tức thì ($0.000...1$ giây). Vòng lặp cộng dồn phía sau tốn thêm $O(C)$. Hoàn toàn tối ưu.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(C)$ để lưu mảng $A$. Bộ nhớ chỉ tốn chưa tới 1KB.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>