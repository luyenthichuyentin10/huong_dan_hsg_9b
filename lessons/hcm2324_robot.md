## 🤖 Bài 1: Robot (HCM 2023-2024)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài (Bóc tách cốt lõi)</div>

Robot di chuyển trên sa bàn kích thước $N \times N$. Từ ô trái-dưới lên ô phải-trên.

**Bước 1: Quy đổi khoảng cách**
Giả sử ô bắt đầu là tọa độ $(1, 1)$, ô đích là $(N, N)$.
Để đến đích, robot bắt buộc phải đi ngang đúng $N - 1$ bước, và đi dọc đúng $N - 1$ bước.
Gọi khoảng cách cần di chuyển ở mỗi trục là $D = N - 1$.

**Bước 2: Sự độc lập của 2 trục**
- Trục ngang (X): Chỉ bị ảnh hưởng bởi lệnh chuyển động sang phải (kích thước $a$ hoặc $b$).
- Trục dọc (Y): Chỉ bị ảnh hưởng bởi lệnh chuyển động lên trên (kích thước $c$ hoặc $d$).
$\Rightarrow$ Ta có thể tách bài toán làm 2 phần hoàn toàn độc lập:
1. Tìm số lệnh ít nhất để đi ngang được đúng quãng đường $D$ bằng các bước $a$ và $b$.
2. Tìm số lệnh ít nhất để đi dọc được đúng quãng đường $D$ bằng các bước $c$ và $d$.
Nếu một trong 2 trục không thể đi tới đích, đáp án là `-1`. Ngược lại, đáp án là tổng số lệnh của 2 trục cộng lại.
<div class="important-note">

**📌 Dạng bài:** Toán - phương trình bậc nhất
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Quy hoạch động 1D (Subtask 1: N ≤ 10)</div>

### 💡 Ý tưởng Subtask 1
Ta viết một hàm `Solve(D, step1, step2)` để tìm số bước ít nhất. Với $N \le 10$ ($D \le 9$), ta có thể dùng Quy hoạch động mảng 1 chiều.
- Gọi `dp[i]` là số lệnh ít nhất để đi được quãng đường `i`.
- `dp[i] = MIN(dp[i - step1] + 1, dp[i - step2] + 1)`.

**Đánh giá:** Cách này chạy rất tốt cho $N$ nhỏ. Nhưng nếu $N=10^6$, mảng DP độ dài $10^6$ khởi tạo 2 lần sẽ hơi tốn kém và không thực sự cần thiết, bởi ta có thể dùng Toán học.
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange" style="background-color: #f59e0b;">Cách 2: Vét cạn 2 vòng lặp (Subtask 2: N ≤ 10^4)</div>

### 💡 Ý tưởng Subtask 2
Đưa về bài toán giải phương trình nghiệm nguyên: $x \cdot a + y \cdot b = D$. Trong đó $x, y \ge 0$.
Yêu cầu: Tìm cặp $(x, y)$ sao cho $x + y$ là nhỏ nhất.
Cách tự nhiên nhất là dùng 2 vòng lặp lồng nhau duyệt mọi giá trị của $x$ và $y$.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">Solve</span>(<span class="var">D</span>, <span class="var">a</span>, <span class="var">b</span>):
    <span class="var">Min_Moves</span> = <span class="val">VÔ_CỰC</span>
    <span class="kw">LẶP</span> <span class="var">x</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="var">D</span>:
        <span class="kw">LẶP</span> <span class="var">y</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="var">D</span>:
            <span class="kw">NẾU</span> (<span class="var">x</span> * <span class="var">a</span> + <span class="var">y</span> * <span class="var">b</span> == <span class="var">D</span>) <span class="kw">THÌ</span>:
                <span class="var">Min_Moves</span> = <span class="fn">MIN</span>(<span class="var">Min_Moves</span>, <span class="var">x</span> + <span class="var">y</span>)
    <span class="kw">TRẢ VỀ</span> <span class="var">Min_Moves</span>
</pre>
**Đánh giá:** 2 vòng lặp lồng nhau mất $O(D^2)$. Với $N \le 10^4 \Rightarrow D \le 9999$. Số phép tính khoảng $10^8$, chạy vừa khít 1 giây để qua 90% số điểm. Nhưng với $N=10^6$, thuật toán sẽ "đứng máy".
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 3: Toán học - Vét cạn 1 vòng lặp (Subtask 3 - 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu O(N)
Tại sao phải dùng vòng lặp thứ 2 để tìm $y$? Nếu ta đã cố định $x$, thì quãng đường còn lại là $D - x \cdot a$.
Để có thể tới đích, quãng đường còn lại này **BẮT BUỘC PHẢI CHIA HẾT** cho $b$.
Tức là: `NẾU ((D - x * a) % b == 0)` thì ta tính ngay được `y = (D - x * a) / b`.
Vòng lặp giảm từ $O(D^2)$ xuống chỉ còn $O(D)$.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">Solve</span>(<span class="var">D</span>, <span class="var">a</span>, <span class="var">b</span>):
    <span class="kw">NẾU</span> (<span class="var">D</span> == <span class="val">0</span>) <span class="kw">TRẢ VỀ</span> <span class="val">0</span>
    <span class="kw">NẾU</span> (<span class="var">a</span> == <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">b</span> == <span class="val">0</span>) <span class="kw">TRẢ VỀ</span> -<span class="val">1</span> <span class="com">// Chống chia cho 0</span>
    
    <span class="var">Min_Moves</span> = -<span class="val">1</span>
    
    <span class="com">// Chỉ lặp x sao cho (x * a) không vượt quá D</span>
    <span class="kw">LẶP</span> <span class="var">x</span> từ <span class="val">0</span> <span class="kw">TRONG KHI</span> (<span class="var">x</span> * <span class="var">a</span> ≤ <span class="var">D</span>):
        <span class="var">Quang_duong_con_lai</span> = <span class="var">D</span> - (<span class="var">x</span> * <span class="var">a</span>)
        
        <span class="kw">NẾU</span> (<span class="var">b</span> > <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">Quang_duong_con_lai</span> % <span class="var">b</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">y</span> = <span class="var">Quang_duong_con_lai</span> / <span class="var">b</span>
            <span class="kw">NẾU</span> (<span class="var">Min_Moves</span> == -<span class="val">1</span> <span class="kw">HOẶC</span> <span class="var">x</span> + <span class="var">y</span> < <span class="var">Min_Moves</span>) <span class="kw">THÌ</span>:
                <span class="var">Min_Moves</span> = <span class="var">x</span> + <span class="var">y</span>
                
        <span class="com">// Trường hợp b = 0 nhưng quãng đường còn lại vừa khít = 0</span>
        <span class="kw">NẾU</span> (<span class="var">b</span> == <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">Quang_duong_con_lai</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="kw">NẾU</span> (<span class="var">Min_Moves</span> == -<span class="val">1</span> <span class="kw">HOẶC</span> <span class="var">x</span> < <span class="var">Min_Moves</span>) <span class="kw">THÌ</span> <span class="var">Min_Moves</span> = <span class="var">x</span>

    <span class="kw">TRẢ VỀ</span> <span class="var">Min_Moves</span>

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">a</span>, <span class="var">b</span>, <span class="var">c</span>, <span class="var">d</span>
<span class="var">D</span> = <span class="var">N</span> - <span class="val">1</span>

<span class="var">Ngang</span> = <span class="fn">Solve</span>(<span class="var">D</span>, <span class="var">a</span>, <span class="var">b</span>)
<span class="var">Doc</span> = <span class="fn">Solve</span>(<span class="var">D</span>, <span class="var">c</span>, <span class="var">d</span>)

<span class="kw">NẾU</span> (<span class="var">Ngang</span> == -<span class="val">1</span> <span class="kw">HOẶC</span> <span class="var">Doc</span> == -<span class="val">1</span>) <span class="kw">THÌ</span>:
    <span class="kw">XUẤT</span> -<span class="val">1</span>
<span class="kw">NGƯỢC LẠI</span>:
    <span class="kw">XUẤT</span> <span class="var">Ngang</span> + <span class="var">Doc</span>
</pre>

**Tại sao $O(N)$ lại qua được giới hạn $10^6$?**
Vì trong C++, một vòng lặp `for` chạy $10^6$ lần chỉ mất khoảng **0.001 giây**, quá thừa thời gian cho giới hạn 1 giây của bài toán! Thuật toán 1 vòng lặp này chính là chân ái.
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: Đánh giá & So sánh các phương pháp giải</div>
    
<p>Bài toán <b>Robot</b> là minh chứng rõ ràng nhất cho việc không phải lúc nào "Quy hoạch động" cũng là trùm cuối. Đôi khi, một chút tư duy Toán học sẽ đánh bại hoàn toàn các mảng lưu trữ đồ sộ. Dưới đây là so sánh 3 cách tiếp cận bài toán trên từng trục tọa độ:</p>

<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 15%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 25%;">Cách 1 (Quy hoạch động)</th>
                    <th class="th-orange" style="width: 30%;">Cách 2 (Vét cạn 2 vòng lặp)</th>
                    <th class="th-green" style="width: 30%;">Cách 3 (Toán học 1 vòng lặp)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng cốt lõi</td>
                    <td>Dùng mảng 1 chiều lưu số bước ít nhất để đi đến từng ô. `dp[i] = min(dp[i-a], dp[i-b]) + 1`</td>
                    <td>Duyệt mọi giá trị của số lần bước $x$ và số lần bước $y$. Nếu $x \cdot a + y \cdot b = D$ thì cập nhật Min.</td>
                    <td>Chỉ duyệt số lần bước $x$. Tính phần dư $D - x \cdot a$. Nếu chia hết cho $b$ thì tính thẳng được $y$.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N)$<br>(Chạy 1 vòng lặp từ $1$ đến $D$)</td>
                    <td>$O(N^2)$<br>(2 vòng lặp lồng nhau)</td>
                    <td><b>$O(N)$</b><br>(Chỉ 1 vòng lặp duy nhất)</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(N)$<br>(Cần mảng độ dài $10^6$)</td>
                    <td><b>$O(1)$</b><br>(Chỉ dùng vài biến int)</td>
                    <td><b>$O(1)$</b><br>(Chỉ dùng vài biến int)</td>
                </tr>
                <tr>
                    <td class="td-label">Vượt qua giới hạn</td>
                    <td>Gặp nguy cơ Tràn bộ nhớ (MLE) hoặc lãng phí thời gian khởi tạo mảng nếu cấp phát không khéo.</td>
                    <td>Dừng lại ở Subtask 2 ($N \le 10^4$). Với $N = 10^6$ tốn $10^{12}$ phép tính $\rightarrow$ <b>TLE</b>.</td>
                    <td><b>Tuyệt đối tối ưu (100% Điểm)</b>. Vượt qua Subtask 3 mượt mà trong $0.001$ giây.</td>
                </tr>
                <tr>
                    <td class="td-label">Bài học sư phạm</td>
                    <td>Thói quen áp dụng máy móc DP mà quên đi bản chất Toán học.</td>
                    <td>Tư duy đơn giản nhất khi giải phương trình nghiệm nguyên Diophantine.</td>
                    <td>Kết hợp Vét cạn (cố định 1 ẩn) và Toán học (chia hết) $\rightarrow$ Giảm hẳn 1 chiều vòng lặp.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>