## ❌ Bài: Nhân kiểu mới (2MULT - HCM 2016-2017)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Gấu định nghĩa một phép nhân mới $A * B$: thay vì nhân bình thường, Gấu lấy **từng chữ số** của $A$ nhân với **từng chữ số** của $B$ rồi cộng tất cả các kết quả lại với nhau.

**Ví dụ:** $123 * 45$
- Các chữ số của $A$ là: $1, 2, 3$.
- Các chữ số của $B$ là: $4, 5$.
- Kết quả $= 1 \times 4 + 1 \times 5 + 2 \times 4 + 2 \times 5 + 3 \times 4 + 3 \times 5 = 54$.

**Dữ liệu:** $1 \le A, B \le 10^{18}$ (tức là $A$ và $B$ có tối đa 19 chữ số).
<div class="important-note">

**📌 Dạng bài:** Số học  
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Duyệt từng cặp chữ số)</div>

### 💡 Ý tưởng
Chuyển $A$ và $B$ thành chuỗi ký tự (string). Ta dùng hai vòng lặp lồng nhau: vòng lặp ngoài duyệt qua từng ký tự của $A$, vòng lặp trong duyệt qua từng ký tự của $B$. Chuyển ký tự thành số, nhân chúng lại và cộng vào tổng.

**Mã giả:**
<pre class="pseudocode">
<span class="kw">NHẬP</span> chuỗi <span class="var">A</span>, <span class="var">B</span>;
<span class="var">Tong</span> = <span class="val">0</span>;

<span class="kw">CHO MỖI</span> chữ số <span class="var">x</span> <span class="kw">TRONG</span> <span class="var">A</span>:
    <span class="kw">CHO MỖI</span> chữ số <span class="var">y</span> <span class="kw">TRONG</span> <span class="var">B</span>:
        <span class="var">Tong</span> = <span class="var">Tong</span> + (<span class="var">x</span> * <span class="var">y</span>);

<span class="kw">XUẤT</span> <span class="var">Tong</span>;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Tối ưu bằng Toán học (Phân phối tích)</div>

### 💡 Khám phá Toán học
Hãy nhìn lại biểu thức ví dụ:
$$1 \times 4 + 1 \times 5 + 2 \times 4 + 2 \times 5 + 3 \times 4 + 3 \times 5$$
Nếu ta nhóm các thừa số chung lại, ta có:
$$= 1 \times (4 + 5) + 2 \times (4 + 5) + 3 \times (4 + 5)$$
$$= (1 + 2 + 3) \times (4 + 5)$$
$$= 6 \times 9 = 54$$

**Kết luận:** Phép "nhân kiểu mới" của Gấu thực chất chính là: 
**[Tổng các chữ số của A] $\times$ [Tổng các chữ số của B]**.

**Mã giả:**
<pre class="pseudocode">
<span class="kw">NHẬP</span> chuỗi <span class="var">A</span>, <span class="var">B</span>;

<span class="var">TongA</span> = <span class="val">0</span>;
<span class="kw">CHO MỖI</span> chữ số <span class="var">x</span> <span class="kw">TRONG</span> <span class="var">A</span>: <span class="var">TongA</span> = <span class="var">TongA</span> + <span class="var">x</span>;

<span class="var">TongB</span> = <span class="val">0</span>;
<span class="kw">CHO MỖI</span> chữ số <span class="var">y</span> <span class="kw">TRONG</span> <span class="var">B</span>: <span class="var">TongB</span> = <span class="var">TongB</span> + <span class="var">y</span>;

<span class="kw">XUẤT</span> <span class="var">TongA</span> * <span class="var">TongB</span>;
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng So sánh Phương pháp</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 40%;">Cách 1: Duyệt lồng nhau (O(N*M))</th>
                    <th class="th-green" style="width: 40%;">Cách 2: Tính tổng chữ số (O(N+M))</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng</td>
                    <td>Mô phỏng chân phương theo đúng mô tả của đề bài.</td>
                    <td>Sử dụng tính chất phân phối $a(x+y) + b(x+y) = (a+b)(x+y)$.</td>
                </tr>
                <tr>
                    <td class="td-label">Số phép tính<br><small style="color:#64748b;">(A, B có 19 chữ số)</small></td>
                    <td>$19 \times 19 = 361$ phép tính.</td>
                    <td>$19 + 19 = 38$ phép tính.</td>
                </tr>
                <tr>
                    <td class="td-label">Đánh giá chung</td>
                    <td class="td-optimal">Vì giới hạn đề chỉ 19 chữ số, cách này <b>VẪN QUA 100% TEST</b>. Rất an toàn nếu không nghĩ ra cách 2.</td>
                    <td class="td-optimal">Tối ưu tuyệt đối. Nếu đề bài cho chuỗi A, B dài $10^5$ ký tự thì bắt buộc phải dùng cách này.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>