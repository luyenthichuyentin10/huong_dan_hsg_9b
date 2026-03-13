## 🔢 Bài: Ma trận bit (MTBIT - HCM 2018-2019)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho ma trận vuông kích thước $N \times N$ ($N \le 2048$) chứa các bit 0 và 1. Ta cần trích xuất các chuỗi bit từ 4 hướng sau:
1. Mọi hàng (từ trái qua phải) $\rightarrow$ Có $N$ chuỗi.
2. Mọi cột (từ trên xuống dưới) $\rightarrow$ Có $N$ chuỗi.
3. Đường chéo chính (từ trên-trái xuống dưới-phải) $\rightarrow$ Có 1 chuỗi.
4. Đường chéo phụ (từ trên-phải xuống dưới-trái) $\rightarrow$ Có 1 chuỗi.

Tổng cộng có $2N + 2$ chuỗi bit. Tất cả đều có **cùng độ dài $N$**.

**Yêu cầu:** Tìm chuỗi nhị phân có giá trị lớn nhất.
<div class="important-note">

**📌 Dạng bài:** Xử ký chuỗi
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp: Duyệt toàn bộ & So sánh chuỗi (O(N²))</div>

### 💡 Ý tưởng Tối ưu
Với $N \le 2048$, số lượng ký tự tối đa của một chuỗi là 2048, hoàn toàn không thể lưu bằng các kiểu số như `long long` (chỉ tối đa 64 bit). 
Tuy nhiên, vì tất cả các chuỗi đều có cùng độ dài $N$, **giá trị của số nhị phân hoàn toàn tương đương với thứ tự từ điển của chuỗi ký tự đó**.
Ví dụ: Chuỗi `"101"` lớn hơn chuỗi `"010"`. Ta có thể dùng phép toán so sánh chuỗi mặc định (`>`, `<`) trong C++/Python/Java/JS một cách trực tiếp!

**Các bước thực hiện:**
1. Khởi tạo một chuỗi `max_str` mang giá trị nhỏ nhất (gồm $N$ ký tự `"0"`).
2. Dùng vòng lặp quét qua từng hàng. Nối các ký tự lại thành chuỗi `s`. Nếu `s > max_str`, cập nhật `max_str = s`.
3. Tương tự, quét qua từng cột, đường chéo chính và đường chéo phụ.
4. Kết quả cuối cùng chính là `max_str`.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NHẬP</span> hàng <span class="var">A[i]</span> <span class="com">// A[i][j] là bit ở hàng i, cột j</span>

<span class="var">max_str</span> = <span class="str">""</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>: <span class="var">max_str</span> = <span class="var">max_str</span> + <span class="str">"0"</span>

<span class="com">// 1. Quét các hàng</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">s</span> = <span class="str">""</span>
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>: <span class="var">s</span> = <span class="var">s</span> + <span class="var">A[i][j]</span>
    <span class="kw">NẾU</span> (<span class="var">s</span> > <span class="var">max_str</span>) <span class="kw">THÌ</span> <span class="var">max_str</span> = <span class="var">s</span>

<span class="com">// 2. Quét các cột</span>
<span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">s</span> = <span class="str">""</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>: <span class="var">s</span> = <span class="var">s</span> + <span class="var">A[i][j]</span>
    <span class="kw">NẾU</span> (<span class="var">s</span> > <span class="var">max_str</span>) <span class="kw">THÌ</span> <span class="var">max_str</span> = <span class="var">s</span>

<span class="com">// 3. Quét đường chéo chính</span>
<span class="var">s</span> = <span class="str">""</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>: <span class="var">s</span> = <span class="var">s</span> + <span class="var">A[i][i]</span>
<span class="kw">NẾU</span> (<span class="var">s</span> > <span class="var">max_str</span>) <span class="kw">THÌ</span> <span class="var">max_str</span> = <span class="var">s</span>

<span class="com">// 4. Quét đường chéo phụ</span>
<span class="var">s</span> = <span class="str">""</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>: <span class="var">s</span> = <span class="var">s</span> + <span class="var">A[i][N - i + 1]</span>
<span class="kw">NẾU</span> (<span class="var">s</span> > <span class="var">max_str</span>) <span class="kw">THÌ</span> <span class="var">max_str</span> = <span class="var">s</span>

<span class="kw">XUẤT</span> <span class="var">max_str</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Quét toàn bộ & So sánh chuỗi</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N^2)$. Ta có $2N + 2$ chuỗi cần trích xuất. Mỗi chuỗi có độ dài $N$ tốn $O(N)$ để đọc và nối. Tổng cộng khoảng $2 \times N^2$ phép tính. Với $N = 2048$, số phép tính $\approx 8 \times 10^6$, hoàn toàn nhẹ nhàng cho giới hạn 1 giây.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(N^2)$ để lưu toàn bộ ma trận (Có thể dùng mảng char 2D để tối ưu thay vì int). Và $O(N)$ để lưu chuỗi <code class="inline-code">max_str</code>. Rất an toàn.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>