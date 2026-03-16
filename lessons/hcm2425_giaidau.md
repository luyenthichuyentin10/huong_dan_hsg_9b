## 🏆 Bài 3: Giải đấu (GIAIDAU - HCM 2024-2025)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích Toán học</div>

**Yêu cầu:** Cho mảng $A$. Với mỗi truy vấn đoạn $[u, v]$, tìm một vị trí cắt $k$ ($u \le k < v$) để chia làm 2 đội (Đội 1 từ $u \dots k$, Đội 2 từ $k+1 \dots v$) sao cho chênh lệch tổng 2 đội là nhỏ nhất.

**Ràng buộc kiểu dữ liệu:** $N \le 10^5$, $A_i \le 10^9$ $\Rightarrow$ Tổng mảng có thể lên tới $10^{14}$ $\rightarrow$ Bắt buộc dùng kiểu `long long`.

**Phân tích công thức:**
- Gọi $S$ là tổng của toàn bộ đoạn $[u, v]$.
- Gọi $L$ là tổng của Đội 1 (từ $u$ đến $k$).
- Khi đó, tổng của Đội 2 chắc chắn là $R = S - L$.
- Độ lệch giữa 2 đội là: $\Delta = |L - R| = |L - (S - L)| = \mathbf{|2L - S|}$.
Để $\Delta$ nhỏ nhất, ta cần tìm một vách ngăn $k$ sao cho $L$ càng gần $\frac{S}{2}$ càng tốt!
<div class="important-note">

**📌 Dạng bài:** Prefix sum - Binary sreach
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1 & 2: Mảng cộng dồn & Quét tuần tự (Subtask 1, 2: N ≤ 1000)</div>

### 💡 Ý tưởng Subtask 1 & 2 (80% Điểm)
Để tính nhanh tổng $S$ và tổng $L$, ta không thể dùng vòng lặp, mà phải tiền xử lý **Mảng cộng dồn (Prefix Sum)**.
Gọi $P[i] = A[1] + A[2] + \dots + A[i]$.
- Tổng đoạn $[u, v]$ là: $S = P[v] - P[u-1]$.
- Tổng Đội 1 (từ $u$ đến $k$) là: $L = P[k] - P[u-1]$.

Với mỗi truy vấn, ta thử đặt vách ngăn $k$ chạy từ $u$ đến $v-1$. Cập nhật độ lệch nhỏ nhất.

<pre class="pseudocode">
<span class="com">// 1. Khởi tạo Mảng cộng dồn (O(N))</span>
<span class="var">P</span> = <span class="fn">Mang</span>(N + 1, <span class="val">0</span>)
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">P</span>[<span class="var">i</span>] = <span class="var">P</span>[<span class="var">i</span>-<span class="val">1</span>] + <span class="var">A</span>[<span class="var">i</span>]

<span class="com">// 2. Trả lời Q truy vấn (O(Q * N))</span>
<span class="kw">LẶP</span> mỗi truy vấn (<span class="var">u</span>, <span class="var">v</span>):
    <span class="var">S</span> = <span class="var">P</span>[<span class="var">v</span>] - <span class="var">P</span>[<span class="var">u</span>-<span class="val">1</span>]
    <span class="var">Min_Diff</span> = <span class="val">VÔ CỰC</span>
    
    <span class="kw">LẶP</span> <span class="var">k</span> từ <span class="var">u</span> <span class="kw">ĐẾN</span> <span class="var">v</span>-<span class="val">1</span>:
        <span class="var">L</span> = <span class="var">P</span>[<span class="var">k</span>] - <span class="var">P</span>[<span class="var">u</span>-<span class="val">1</span>]
        <span class="var">R</span> = <span class="var">S</span> - <span class="var">L</span>
        <span class="var">Diff</span> = <span class="fn">TRỊ_TUYỆT_ĐỐI</span>(<span class="var">L</span> - <span class="var">R</span>)
        <span class="var">Min_Diff</span> = <span class="fn">MIN</span>(<span class="var">Min_Diff</span>, <span class="var">Diff</span>)
        
    <span class="kw">XUẤT</span> <span class="var">Min_Diff</span>
</pre>
**Đánh giá:** Thời gian trả lời mỗi truy vấn là $O(N)$. Tổng thời gian $O(N + Q \times N)$. 
Vượt qua dễ dàng Subtask 2 ($Q=10^4, N=10^3$) với khoảng $10^7$ phép tính. Nhưng sẽ bị TLE ở Subtask 3 ($Q=10^5, N=10^5$) vì cần tới $10^{10}$ phép tính.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 3: Chặt nhị phân (Subtask 3 - 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu (O(Q log N))
Tại sao phải chạy vòng lặp $k$ tìm từ từ? 
Vì tất cả các ranking $A_i$ đều là số nguyên dương ($A_i \ge 1$), nên **mảng cộng dồn $P$ luôn tăng ngặt**.
Mục tiêu của ta là tìm $k$ sao cho $L \approx \frac{S}{2}$.
Thay vì tìm $L$, ta tìm thẳng giá trị $P[k]$ lý tưởng:
$$L \approx \frac{S}{2} \implies P[k] - P[u-1] \approx \frac{P[v] - P[u-1]}{2}$$
$$\implies P[k] \approx \frac{P[v] + P[u-1]}{2}$$

Đây là một hằng số! Ta gọi $Target = \frac{P[v] + P[u-1]}{2}$.
Vì mảng $P$ đã sắp xếp tăng dần, ta có thể dùng **Thuật toán Tìm kiếm nhị phân (Binary Search - lower_bound)** để tìm nhanh vị trí $k$ sao cho $P[k] \ge Target$ trong đoạn $[u, v-1]$.
Khi tìm được $k$, vách ngăn tối ưu **chỉ có thể nằm ở $k$ hoặc $k-1$** (1 giá trị lớn hơn hoặc bằng Target, và 1 giá trị nhỏ hơn Target). Ta chỉ việc kiểm tra 2 vị trí này và lấy Min.

<pre class="pseudocode">
<span class="kw">LẶP</span> mỗi truy vấn (<span class="var">u</span>, <span class="var">v</span>):
    <span class="var">S</span> = <span class="var">P</span>[<span class="var">v</span>] - <span class="var">P</span>[<span class="var">u</span>-<span class="val">1</span>]
    <span class="var">Target</span> = (<span class="var">P</span>[<span class="var">v</span>] + <span class="var">P</span>[<span class="var">u</span>-<span class="val">1</span>]) / <span class="val">2</span>
    
    <span class="com">// Dùng Binary Search tìm k đầu tiên trong đoạn [u, v-1] có P[k] >= Target</span>
    <span class="var">k</span> = <span class="fn">Lower_Bound</span>(P, <span class="var">u</span>, <span class="var">v</span>-<span class="val">1</span>, <span class="var">Target</span>)
    
    <span class="var">Min_Diff</span> = <span class="val">VÔ CỰC</span>
    <span class="com">// Kiểm tra ứng viên k</span>
    <span class="kw">NẾU</span> (<span class="var">k</span> hợp lệ):
        <span class="var">Min_Diff</span> = <span class="fn">MIN</span>(<span class="var">Min_Diff</span>, <span class="fn">Tính_Độ_Lệch</span>(<span class="var">k</span>))
    <span class="com">// Kiểm tra ứng viên k - 1</span>
    <span class="kw">NẾU</span> (<span class="var">k</span> - <span class="val">1</span> >= <span class="var">u</span>):
        <span class="var">Min_Diff</span> = <span class="fn">MIN</span>(<span class="var">Min_Diff</span>, <span class="fn">Tính_Độ_Lệch</span>(<span class="var">k</span> - <span class="val">1</span>))
        
    <span class="kw">XUẤT</span> <span class="var">Min_Diff</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: So sánh & Đánh giá Thuật toán</div>
    
<p>Bài toán <b>Giải đấu</b> là một ví dụ mẫu mực để thấy sự lợi hại của <b>Tìm kiếm nhị phân (Binary Search)</b> khi được kết hợp cùng <b>Mảng cộng dồn (Prefix Sum)</b>. Dưới đây là bảng so sánh sự tiến hóa của hai cách giải:</p>

<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 40%;">Cách 1 & 2: Quét vách ngăn (Tuần tự)</th>
                    <th class="th-green" style="width: 40%;">Cách 3: Chặt nhị phân (Binary Search)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng cốt lõi</td>
                    <td>Thử dời vách ngăn từng bước một từ vị trí $u$ đến $v-1$. Ở mỗi bước, tính tổng 2 đội bằng Mảng cộng dồn rồi cập nhật độ lệch Min.</td>
                    <td>Mục tiêu là chia đôi tổng. Tính $Target = \frac{Tổng}{2}$. Lợi dụng tính chất <b>mảng cộng dồn luôn tăng ngặt</b> để dùng thuật toán Tìm kiếm nhị phân "chỉ điểm" thẳng vào vị trí vách ngăn tối ưu.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td><b>$O(N + Q \times N)$</b><br>Mất $O(N)$ cho mỗi lần trả lời truy vấn.</td>
                    <td><b>$O(N + Q \log N)$</b><br>Chỉ mất $O(\log N)$ cho mỗi lần trả lời truy vấn.</td>
                </tr>
                <tr>
                    <td class="td-label">Khả năng vượt test</td>
                    <td>Vượt qua Subtask 1, 2 ($N, Q \le 10^4$).<br>Sẽ bị <b>TLE (Quá thời gian)</b> ở Subtask 3 vì tốn khoảng $10^{10}$ phép tính.</td>
                    <td><b>Tuyệt đối Tối ưu (100% Điểm)</b>.<br>Vượt qua Subtask 3 ($N, Q \le 10^5$) nhẹ nhàng trong $0.05$ giây (khoảng $1.7 \times 10^6$ phép tính).</td>
                </tr>
                <tr>
                    <td class="td-label">Bài học sư phạm</td>
                    <td>Biết cách dùng mảng cộng dồn để đưa việc tính tổng đoạn $O(N)$ về $O(1)$. Tránh được vòng lặp lồng nhau rườm rà.</td>
                    <td>Biết phân tích mục tiêu của bài toán (tìm tổng gần $\frac{S}{2}$) và nhận diện được tính chất <b>có hướng (monotonic)</b> của dữ liệu để áp dụng Binary Search.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>