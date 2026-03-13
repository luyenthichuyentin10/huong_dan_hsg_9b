## 🔐 Bài 2: Mật thư (MATTHU - HCM 2022-2023)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một chuỗi độ dài $N$ chứa $M$ ký tự `#`.

Có $M$ dòng tiếp theo, dòng thứ $i$ chứa một xâu $K$ ký tự. Các ký tự này là các lựa chọn để thay thế cho dấu `#` thứ $i$.

**Quy trình:** Nếu ta tạo ra TẤT CẢ các chuỗi có thể có ($K^M$ chuỗi), sau đó sắp xếp chúng theo thứ tự từ điển tăng dần.

**Yêu cầu:** In ra chuỗi nằm ở vị trí thứ $X$ (tính từ 1) trong danh sách đã sắp xếp.

Giới hạn: $1 \le X \le 10^9$. $K \le 26$.
<div class="important-note">

**📌 Dạng bài:** Xử lý chuỗi - đổi hệ số
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1 & 2: M = 1 (Subtask 1 và 2)</div>

### 💡 Ý tưởng Subtask 1 & 2
Hai subtask đầu tiên (chiếm 50% số điểm) đều có $M = 1$. Nghĩa là chuỗi chỉ có **DUY NHẤT một dấu `#`**.
- Với 1 dấu `#` và xâu tùy chọn có $K$ ký tự, ta chỉ tạo ra được đúng $K$ chuỗi.
- Vì các chuỗi này giống hệt nhau ở mọi vị trí (trừ vị trí dấu `#`), nên việc **sắp xếp các chuỗi** hoàn toàn tương đương với việc **sắp xếp các ký tự lựa chọn** theo bảng chữ cái.
- **Thuật toán:** Ta chỉ cần lấy xâu lựa chọn của dấu `#` duy nhất này, sắp xếp các ký tự của nó tăng dần, rồi lấy ký tự ở vị trí thứ $X$ (tức là index $X-1$) đắp vào chuỗi gốc là xong!

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">M</span>, <span class="var">K</span>, <span class="var">X</span>
<span class="kw">NHẬP</span> chuỗi gốc <span class="var">S</span>
<span class="kw">NHẬP</span> chuỗi lựa chọn <span class="var">Options</span>

<span class="com">// Sắp xếp các ký tự lựa chọn theo bảng chữ cái</span>
<span class="var">Options</span> = <span class="fn">Sap_Xep_Tang_Dan</span>(<span class="var">Options</span>)

<span class="com">// Lấy ký tự thứ X (chỉ số X-1 vì mảng bắt đầu từ 0)</span>
<span class="var">Ky_tu_chon</span> = <span class="var">Options</span>[<span class="var">X</span> - <span class="val">1</span>]

<span class="com">// Thay thế dấu '#' duy nhất bằng ký tự vừa chọn</span>
<span class="var">S</span> = <span class="fn">Thay_The</span>(<span class="var">S</span>, <span class="str">'#'</span>, <span class="var">Ky_tu_chon</span>)
<span class="kw">XUẤT</span> <span class="var">S</span>
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 3: Phép toán Hệ Cơ Số (Subtask 3 - 100% Điểm)</div>

### 💡 Ý tưởng Subtask 3 (M ≤ 500)
Khi $M$ lên tới 500, số lượng chuỗi tạo ra là $K^{500}$, một con số khổng lồ không thể sinh ra hay sắp xếp bằng mảng được! Ta phải phân tích quy luật.

Giả sử ta đã sắp xếp TẤT CẢ các xâu lựa chọn theo thứ tự từ điển.
Khi ghép các lựa chọn này lại để tạo chuỗi, hãy để ý sự thay đổi:
- Dấu `#` cuối cùng (bên phải cùng) sẽ thay đổi liên tục qua từng chuỗi (giống như hàng đơn vị).
- Dấu `#` kề cuối sẽ chỉ thay đổi sau mỗi $K$ chuỗi (giống như hàng chục).
$\Rightarrow$ Đây chính xác là nguyên lý đếm của **Hệ cơ số $K$**!

**Ví dụ**:
- Ta có thể đánh số thứ tự cho các kí tự trong bảng chữ cái với quy định tự đặt ra như: **a $\rightarrow$ 0, b $\rightarrow$ 1, c $\rightarrow$ 2, d $\rightarrow$ 3, ... z $\rightarrow$ 26**
- Từ đó ta có thể chuyển các kí tự về thành các số như **aaaa $\rightarrow$ 0000, aaab $\rightarrow$ 0001, ..., adcb $\rightarrow$ 0321, ...**
- Ta có thể xem mỗi cách sắp xếp các kí tự vào vị trí dấu # là một con số.
- Giá trị $K$ có thể xem là cơ số của số đang xét, $K = 2$ là cơ số $2$, $K = 3$ là cơ số $3, ..., K = 26$ cơ số $26$
- Xét $K = 2$, $M = 3$ có $3$ vị trí, mỗi vị trí có thể điền thử $2$ kí tự nên tổng số trường hợp là $2^3$
    - a(0) g(1)
    - i(0) v(1)
    - e(0) f(1)
    - 0: 000 $\rightarrow$ aie
    - 1: 001 $\rightarrow$ aif
    - 2: 010 $\rightarrow$ ave
    - 3: 011 $\rightarrow$ avf
    - 4: 100 $\rightarrow$ gie
    - **5: 101 $\rightarrow$ gif**
    - 6: 110 $\rightarrow$ gve
    - 7: 111 $\rightarrow$ gvf

**Thuật toán chuyển đổi hệ cơ số:**
1. Sắp xếp **toàn bộ** $M$ xâu lựa chọn theo thứ tự từ điển.
2. Vì ta tìm chuỗi thứ $X$ (1-based index), để dễ chia dư, ta đặt **$Y = X - 1$** (0-based index).
3. Duyệt các dấu `#` **từ phải qua trái** (từ $M$ lùi về 1):
   - Ký tự được chọn cho dấu `#` hiện tại nằm ở chỉ số: `idx = Y % K`.
   - Cập nhật lại $Y$: `Y = Y / K` (chia lấy phần nguyên).
4. Ghép các ký tự tìm được vào chuỗi gốc. Vậy là xong, hoàn toàn không cần sinh hay lưu trữ bất kỳ chuỗi phụ nào!

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">M</span>, <span class="var">K</span>, <span class="var">X</span>
<span class="kw">NHẬP</span> <span class="var">S</span>
<span class="var">Options</span> = <span class="fn">Mang</span>(M)

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">M</span>:
    <span class="kw">NHẬP</span> <span class="var">Options</span>[<span class="var">i</span>]
    <span class="var">Options</span>[<span class="var">i</span>] = <span class="fn">Sap_Xep_Tang_Dan</span>(<span class="var">Options</span>[<span class="var">i</span>]) <span class="com">// Sắp xếp A-Z</span>

<span class="var">Y</span> = <span class="var">X</span> - <span class="val">1</span>
<span class="var">Chi_so_dau_thang</span> = <span class="var">M</span>

<span class="com">// Duyệt chuỗi S từ phải qua trái để thay thế '#'</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">N</span> <span class="kw">GIẢM VỀ</span> <span class="val">1</span>:
    <span class="kw">NẾU</span> (<span class="var">S</span>[<span class="var">i</span>] == <span class="str">'#'</span>) <span class="kw">THÌ</span>:
        <span class="com">// Lấy phần dư để tìm vị trí ký tự trong bảng Options</span>
        <span class="var">idx</span> = <span class="var">Y</span> % <span class="var">K</span>
        
        <span class="var">S</span>[<span class="var">i</span>] = <span class="var">Options</span>[<span class="var">Chi_so_dau_thang</span>][<span class="var">idx</span>]
        
        <span class="com">// Chia K để tính cho dấu '#' tiếp theo bên trái</span>
        <span class="var">Y</span> = <span class="fn">Phan_Nguyen</span>(<span class="var">Y</span> / <span class="var">K</span>)
        <span class="var">Chi_so_dau_thang</span> = <span class="var">Chi_so_dau_thang</span> - <span class="val">1</span>

<span class="kw">XUẤT</span> <span class="var">S</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Toán học - Đổi Hệ Cơ Số</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(M \times K \log K + N)$. Việc sắp xếp $M$ chuỗi con tốn rất ít thời gian vì $K \le 26$. Vòng lặp thay thế chạy đúng $N$ lần. Tổng số phép tính vô cùng nhỏ, dễ dàng đạt 100% số điểm.</td>
                </tr>
                <tr>
                    <td class="td-label">Sự tinh tế</td>
                    <td>Biến một bài toán sinh tổ hợp ngỡ như cần đệ quy phức tạp và gây nổ RAM thành một vòng lặp chia dư đơn giản của môn Toán lớp 6.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>