## ❓ Bài: Tạo câu đố (CAUDO - HCM 2019-2020)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài (Giải mã quy luật)</div>

Đề bài cho một danh sách các câu đố bằng hình vẽ quy đổi ra số.

Nếu ta thử thay **Hình tròn (O) = 0** và **Hình tam giác (A) = 1**, ta sẽ có:
- `O O O O O` = `00000` = 0
- `O O O O A` = `00001` = 1
- `O O O A O` = `00010` = 2
- `O O O A A` = `00011` = 3
- `O O A O A` = `00101` = 5
- `O O A A O` = `00110` = 6
- `O A O O A` = `01001` = 9

**Kết luận:** Quy luật của bài toán chính là biểu diễn **Hệ Nhị Phân (Cơ số 2)** của số nguyên $N$. Với yêu cầu số lượng ký tự tối thiểu là 5, nếu biểu diễn nhị phân của $N$ ngắn hơn 5 ký tự, ta phải chèn thêm các số 0 (ký tự 'O') vào phía trước.
<div class="important-note">

**📌 Dạng bài:** Tìm quy luật - đổi hệ số
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp: Chuyển đổi Cơ số 10 sang Cơ số 2</div>

### 💡 Ý tưởng Thuật toán
1. **Chuyển cơ số:** Để chuyển một số $N$ ở hệ thập phân sang hệ nhị phân, ta thực hiện chia liên tiếp $N$ cho 2. Phần dư của các phép chia này (lấy ngược từ dưới lên) chính là biểu diễn nhị phân của $N$.
2. **Kiểu dữ liệu:** Do $N \le 10^{18}$, ta bắt buộc phải sử dụng kiểu số nguyên 64-bit (`long long` trong C++, hoặc `BigInt` trong JS/Python). Nếu dùng `int` 32-bit (chỉ lưu được tối đa khoảng $2 \times 10^9$), chương trình sẽ bị sai với 50% test lớn.
3. **Thêm padding:** Nếu mảng lưu các bit có kích thước nhỏ hơn 5, ta tiếp tục nhét thêm số 0 vào cho đến khi đủ 5 phần tử.
4. **Ánh xạ ký tự:** Đảo ngược mảng (do ta lấy phần dư từ dưới lên), in ra 'O' nếu là 0, và 'A' nếu là 1. Các ký tự cách nhau khoảng trắng.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="com">// Sử dụng kiểu dữ liệu 64-bit cho N</span>
<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="var">Bits</span> = []

<span class="com">// Xử lý riêng trường hợp N = 0</span>
<span class="kw">NẾU</span> (<span class="var">N</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
    <span class="var">Bits</span>.Them(<span class="val">0</span>)
<span class="kw">NGƯỢC LẠI</span>:
    <span class="com">// Chuyển đổi sang nhị phân (lấy phần dư)</span>
    <span class="kw">LẶP TRONG KHI</span> (<span class="var">N</span> > <span class="val">0</span>):
        <span class="var">du</span> = <span class="var">N</span> % <span class="val">2</span>
        <span class="var">Bits</span>.Them(<span class="var">du</span>)
        <span class="var">N</span> = <span class="var">N</span> / <span class="val">2</span>

<span class="com">// Thêm số 0 vào đầu (sau khi đảo mảng) nếu chưa đủ 5 ký tự</span>
<span class="kw">LẶP TRONG KHI</span> (<span class="fn">Kich_Thuoc</span>(<span class="var">Bits</span>) < <span class="val">5</span>):
    <span class="var">Bits</span>.Them(<span class="val">0</span>)

<span class="var">Bits</span>.<span class="fn">Dao_Nguoc_Mang</span>()

<span class="var">KetQua</span> = <span class="str">""</span>
<span class="kw">LẶP MỖI</span> <span class="var">bit</span> <span class="kw">TRONG</span> <span class="var">Bits</span>:
    <span class="kw">NẾU</span> (<span class="var">bit</span> == <span class="val">0</span>) <span class="kw">THÌ</span> <span class="var">KetQua</span> = <span class="var">KetQua</span> + <span class="str">"O "</span>
    <span class="kw">NGƯỢC LẠI</span> <span class="var">KetQua</span> = <span class="var">KetQua</span> + <span class="str">"A "</span>

<span class="kw">XUẤT</span> <span class="var">KetQua</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Chia dư liên tiếp (Modulo)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(\log_2 N)$. Mỗi phép chia đôi làm giảm $N$ đi một nửa. Với $N = 10^{18}$, vòng lặp chỉ chạy tối đa khoảng 60 lần. Tốc độ thực thi cực kỳ nhanh (xấp xỉ $O(1)$).</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(\log_2 N)$ để lưu trữ mảng các bit. Cần tối đa khoảng 60 phần tử, bộ nhớ gần như không đáng kể.</td>
                </tr>
                <tr>
                    <td class="td-label">Lưu ý cực kỳ quan trọng</td>
                    <td>Bài toán có thể có test case $N = 0$. Vòng lặp <code class="inline-code">while (N > 0)</code> sẽ không chạy nếu không xử lý riêng. Khi đó kết quả phải in ra đúng 5 chữ <code class="inline-code">O O O O O</code>.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>