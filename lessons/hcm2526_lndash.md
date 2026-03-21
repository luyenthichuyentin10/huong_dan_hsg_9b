## 🚶 Bài 3: Trò chơi LineDash (Đề tham khảo HCM 25-26)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích Toán học & Vật lý của bài toán</div>

**Giải mã chuyển động:**
Nhân vật di chuyển trên mặt phẳng tọa độ Oxy. Trong 1 giây, tùy vào lệnh mà nhân vật đi được quãng đường (vận tốc) khác nhau:
- Lệnh `-` (Đi ngang): Tọa độ $(x+1, y)$. Quãng đường đi được là $1$.
- Lệnh `/` (Đi chéo lên): Tọa độ $(x+1, y+1)$. Theo định lý Pytago, quãng đường là $\sqrt{1^2 + 1^2} = \sqrt{2}$.
- Lệnh `\` (Đi chéo xuống): Tọa độ $(x+1, y-1)$. Quãng đường là $\sqrt{1^2 + (-1)^2} = \sqrt{2}$.
- $\Rightarrow$ Tóm lại, nhân vật chỉ có **2 tốc độ**: $V = 1$ (khi đi ngang) và $V = \sqrt{2}$ (khi đi chéo).

Bài toán yêu cầu tính tổng quãng đường nhân vật đi được trong khoảng thời gian từ $L$ đến $R$.
<div class="important-note">

**📌 Dạng bài:** Hình học - prefix sum - binary sreach
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Toán học O(1) (Subtask 1: N = 0)</div>

### 💡 Ý tưởng Subtask 1 (20% Điểm)
Khi $N = 0$, nghĩa là không có lệnh chuyển hướng nào.
Theo mặc định của đề bài, lúc này nhân vật luôn đi theo chiều ngang (lệnh `-`) với vận tốc $V = 1$.
Quãng đường đi được từ thời điểm $L$ đến $R$ chính là:
**$\text{Distance} = (R - L) \times 1 = R - L$**

<pre class="pseudocode">
<span class="kw">LẶP</span> mỗi truy vấn (<span class="var">L</span>, <span class="var">R</span>):
    <span class="kw">XUẤT</span> <span class="var">R</span> - <span class="var">L</span>
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Cắt đoạn thẳng O(1) (Subtask 2: N = 1)</div>

### 💡 Ý tưởng Subtask 2 (20% Điểm)
Khi $N = 1$ và không có lệnh `-`.
Nghĩa là tại thời điểm $T_1$, nhân vật chuyển từ đi ngang ($V = 1$) sang đi chéo ($V = \sqrt{2}$).
Với mỗi truy vấn $[L, R]$, ta cần xem đoạn thời gian này rớt vào giai đoạn nào:
- Nếu $R \le T_1$: Toàn bộ thời gian đều đi ngang $\rightarrow \text{Ans} = R - L$.
- Nếu $L \ge T_1$: Toàn bộ thời gian đều đi chéo $\rightarrow \text{Ans} = (R - L) \times \sqrt{2}$.
- Nếu $L < T_1 < R$: Khoảng thời gian bị cắt làm đôi.
  $\text{Ans} = (T_1 - L) \times 1 + (R - T_1) \times \sqrt{2}$.

<pre class="pseudocode">
<span class="var">V_CHEO</span> = <span class="fn">SQRT</span>(<span class="val">2.0</span>)
<span class="kw">LẶP</span> mỗi truy vấn (<span class="var">L</span>, <span class="var">R</span>):
    <span class="kw">NẾU</span> (<span class="var">R</span> ≤ <span class="var">T1</span>) <span class="kw">XUẤT</span> <span class="var">R</span> - <span class="var">L</span>
    <span class="kw">NGƯỢC LẠI NẾU</span> (<span class="var">L</span> ≥ <span class="var">T1</span>) <span class="kw">XUẤT</span> (<span class="var">R</span> - <span class="var">L</span>) * <span class="var">V_CHEO</span>
    <span class="kw">NGƯỢC LẠI XUẤT</span> (<span class="var">T1</span> - <span class="var">L</span>) + (<span class="var">R</span> - <span class="var">T1</span>) * <span class="var">V_CHEO</span>
</pre>
</div>

<div class="step-card border-blue">
<div class="step-badge bg-blue">Cách 3 & 4: Mảng cộng dồn theo thời gian (Subtask 3 & 4: T ≤ 10^6)</div>

### 💡 Ý tưởng Subtask 3 & 4 (50% Điểm)
Khi $T \le 10^6$, ta có thể lưu một mảng tĩnh mô phỏng từng giây một.
Gọi `dist[t]` là **tổng quãng đường nhân vật đi được từ giây 0 đến giây t**.
- Đầu tiên, ta duyệt qua danh sách các lệnh để xác định xem tại giây thứ $t$, nhân vật đang đi với vận tốc $V_t$ là bao nhiêu ($1$ hoặc $\sqrt{2}$).
- Xây dựng mảng cộng dồn: `dist[t] = dist[t-1] + V_t`.
- Trả lời truy vấn $[L, R]$ trong $O(1)$: $\text{Ans} = dist[R] - dist[L]$.

<pre class="pseudocode">
<span class="var">Dist</span> = <span class="fn">Mang_So_Thuc</span>(<span class="val">1000005</span>, <span class="val">0.0</span>)
<span class="var">event_idx</span> = <span class="val">1</span>
<span class="var">current_speed</span> = <span class="val">1.0</span> <span class="com">// Vận tốc mặc định ban đầu là đi ngang</span>

<span class="com">// Xây dựng mảng cộng dồn quãng đường</span>
<span class="kw">LẶP</span> <span class="var">t</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">T</span>:
    <span class="com">// Vì T1 < T2 < ... < Tn nên chỉ cần dùng IF để kiểm tra lệnh tại giây t-1</span>
    <span class="kw">NẾU</span> (<span class="var">event_idx</span> ≤ <span class="var">N</span> <span class="kw">VÀ</span> <span class="var">T_lệnh</span>[<span class="var">event_idx</span>] == <span class="var">t</span> - <span class="val">1</span>) <span class="kw">THÌ</span>:
        <span class="kw">NẾU</span> (<span class="var">C_lệnh</span>[<span class="var">event_idx</span>] == <span class="str">'-'</span>) <span class="kw">THÌ</span>
            <span class="var">current_speed</span> = <span class="val">1.0</span>
        <span class="kw">NGƯỢC LẠI</span>
            <span class="var">current_speed</span> = <span class="fn">SQRT</span>(<span class="val">2.0</span>)
        
        <span class="var">event_idx</span> = <span class="var">event_idx</span> + <span class="val">1</span>
        
    <span class="com">// Bất kể có lệnh đổi hướng hay không, nhân vật vẫn di chuyển</span>
    <span class="var">Dist</span>[<span class="var">t</span>] = <span class="var">Dist</span>[<span class="var">t</span>-<span class="val">1</span>] + <span class="var">current_speed</span>

<span class="com">// Trả lời Q truy vấn trong O(1)</span>
<span class="kw">LẶP</span> mỗi truy vấn (<span class="var">L</span>, <span class="var">R</span>):
    <span class="kw">XUẤT</span> <span class="var">Dist</span>[<span class="var">R</span>] - <span class="var">Dist</span>[<span class="var">L</span>]
</pre>

**Đánh giá:** Tạo mảng mất $O(T)$, trả lời $Q$ truy vấn mất $O(Q)$. Tổng thời gian $O(T + Q)$. Vượt qua $T \le 10^6$ dễ dàng. Nhưng Subtask 5 có $T \le 10^9$, không thể khai báo mảng kích thước tỷ phần tử (sẽ bị tràn RAM Memory Limit Exceeded).
</div>

<div class="step-card border-purple">
<div class="step-badge bg-purple">Cách 5: Cộng dồn Mốc sự kiện + Chặt nhị phân (Subtask 5 - 100% Điểm)</div>

### 1. Tại sao phải chuyển từ Prefix Sum thuần túy sang Prefix Sum + Binary Search?

Trong Subtask 3 & 4, ta dùng mảng <code>dist[t]</code> với index <code>t</code> là từng giây đồng hồ. 
* **Vấn đề:** Ở Subtask 5, thời gian $T$ lên tới $10^9$. Nếu ta khai báo mảng <code>double dist[1000000000]</code>, chương trình sẽ ngốn khoảng **8GB RAM** $\rightarrow$ Gây lỗi **Tràn bộ nhớ (MLE)**. Đồng thời, vòng lặp tỷ lần sẽ gây **Quá thời gian (TLE)**.
* **Giải pháp:** Dù $T$ trôi qua rất lâu (1 tỷ giây), người chơi chỉ ra lệnh đổi hướng tối đa $N$ lần ($N \le 10^5$). Vận tốc của nhân vật chỉ thay đổi tại đúng $10^5$ thời điểm (các mốc sự kiện). Ở giữa 2 mốc, vận tốc là không đổi.
* **Kết luận:** Thay vì lưu quãng đường tại *từng giây*, ta chỉ lưu quãng đường tại *các mốc sự kiện*. Bằng cách này, kích thước mảng giảm từ $O(T)$ xuống $O(N)$, xử lý triệt để bài toán tài nguyên.

---

### 2. Cấu trúc Mảng Sự Kiện P khác Mảng Dist như thế nào?

* **Mảng <code>dist[t]</code> (Sub 3, 4):**
  * Ý nghĩa: Lưu quãng đường ở giây thứ <code>t</code>. Tính bằng <code>dist[t-1] + V_hiện_tại</code>. Truy vấn $O(1)$.
* **Mảng <code>P[i]</code> (Sub 5):**
  * Ý nghĩa: Lưu tổng quãng đường tính đến **sự kiện đổi hướng thứ i** (thời điểm $T_i$).
  * Công thức: 
    $$P[i] = P[i-1] + V_{i-1} \times (T_i - T_{i-1})$$
  * Khi cần tính quãng đường tại một thời điểm $X$ nằm lơ lửng giữa 2 mốc, ta không thể bốc thẳng ra được mà phải dùng **Tìm kiếm nhị phân (Binary Search)** để xác định vị trí của $X$.

---

### 3. Áp dụng Binary Search vào thuật toán tính Quãng đường

Ta xây dựng hàm <code>GetDist(X)</code> để tính quãng đường từ $0$ đến $X$:
1. **Chặt nhị phân:** Mảng các mốc thời gian $T$ đang tăng dần. Dùng Binary Search tìm chỉ số $k$ lớn nhất sao cho **$T_k \le X$** (Xác định sự kiện cuối cùng xảy ra trước thời điểm $X$).
2. **Tính toán:** Quãng đường gồm 2 phần:
   - Phần 1 (Đã đi đến mốc $k$): Chính là <code>P[k]</code>.
   - Phần 2 (Đi thêm từ mốc $k$ đến $X$): Bằng $V_k \times (X - T_k)$.
   $\Rightarrow GetDist(X) = P[k] + V_k \times (X - T_k)$.

---

### 4. Ví dụ minh họa từng bước (Trace Test mẫu)

Theo test ví dụ: $T = 5$. Lệnh 1: $T_1 = 1$, đi chéo lên ($\sqrt{2}$). Lệnh 2: $T_2 = 3$, đi ngang ($1$). Lệnh 3: $T_3 = 4$, đi chéo xuống ($\sqrt{2}$).

**Bước A: Xây dựng mảng Sự kiện & P**
Mặc định có sự kiện 0: $T_0 = 0, V_0 = 1, P_0 = 0$.
* Sự kiện 1 ($T_1 = 1, V_1 = \sqrt{2}$): $P[1] = 0 + 1 \times (1 - 0) = \mathbf{1}$
* Sự kiện 2 ($T_2 = 3, V_2 = 1$): $P[2] = 1 + \sqrt{2} \times (3 - 1) = \mathbf{1 + 2\sqrt{2}}$
* Sự kiện 3 ($T_3 = 4, V_3 = \sqrt{2}$): $P[3] = (1 + 2\sqrt{2}) + 1 \times (4 - 3) = \mathbf{2 + 2\sqrt{2}}$

**Bước B: Xử lý Truy vấn đoạn [2, 4]**
Cần tính $GetDist(4) - GetDist(2)$.
* **GetDist(4):** Nhị phân tìm được $k=3$ ($T_3 \le 4$). 
  $\Rightarrow GetDist(4) = P[3] + V_3 \times (4 - 4) = \mathbf{2 + 2\sqrt{2}}$.
* **GetDist(2):** Nhị phân tìm được $k=1$ ($T_1 \le 2 < T_2$). 
  $\Rightarrow GetDist(2) = P[1] + V_1 \times (2 - 1) = 1 + \sqrt{2} \times 1 = \mathbf{1 + \sqrt{2}}$.
* **Kết quả:** $(2 + 2\sqrt{2}) - (1 + \sqrt{2}) = \mathbf{1 + \sqrt{2}} \approx \mathbf{2.414214}$ (Khớp 100% test mẫu).

---

### 5. Mã giả chi tiết cài đặt Subtask 5

<pre class="pseudocode">
<span class="com">// Cấu trúc lưu trữ 1 Sự kiện</span>
<span class="kw">CẤU_TRÚC</span> <span class="var">Event</span>:
    <span class="var">T</span>: Thời điểm xảy ra lệnh
    <span class="var">V</span>: Vận tốc nhân vật TỪ thời điểm này
    <span class="var">P</span>: Tổng quãng đường ĐÃ ĐI ĐƯỢC tính đến thời điểm này

<span class="var">E</span> = <span class="fn">Mảng rỗng chứa các Event</span>
<span class="var">E</span>.<span class="fn">Push</span>({<span class="var">T</span>: <span class="val">0</span>, <span class="var">V</span>: <span class="val">1.0</span>, <span class="var">P</span>: <span class="val">0.0</span>}) <span class="com">// Sự kiện mặc định lúc bắt đầu</span>

<span class="com">// 1. Tiền xử lý (O(N))</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">dt</span> = <span class="var">T_lệnh</span>[<span class="var">i</span>] - <span class="var">E</span>[<span class="var">i</span>-<span class="val">1</span>].<span class="var">T</span>
    <span class="var">Current_P</span> = <span class="var">E</span>[<span class="var">i</span>-<span class="val">1</span>].<span class="var">P</span> + <span class="var">E</span>[<span class="var">i</span>-<span class="val">1</span>].<span class="var">V</span> * <span class="var">dt</span>
    
    <span class="kw">NẾU</span> (<span class="var">C_lệnh</span>[<span class="var">i</span>] == <span class="str">'-'</span>) <span class="kw">THÌ</span> <span class="var">Current_V</span> = <span class="val">1.0</span>
    <span class="kw">NGƯỢC LẠI</span> <span class="var">Current_V</span> = <span class="fn">SQRT</span>(<span class="val">2.0</span>)
    
    <span class="var">E</span>.<span class="fn">Push</span>({<span class="var">T</span>: <span class="var">T_lệnh</span>[<span class="var">i</span>], <span class="var">V</span>: <span class="var">Current_V</span>, <span class="var">P</span>: <span class="var">Current_P</span>})

<span class="com">// 2. Hàm Tìm kiếm nhị phân & Tính quãng đường O(log N)</span>
<span class="kw">HÀM</span> <span class="fn">GetDist</span>(<span class="var">X</span>):
    <span class="var">low</span> = <span class="val">0</span>
    <span class="var">high</span> = <span class="var">N</span>
    <span class="var">k</span> = <span class="val">0</span>
    
    <span class="com">// Binary Search tìm mốc thời gian E[mid].T lớn nhất <= X</span>
    <span class="kw">TRONG KHI</span> (<span class="var">low</span> <= <span class="var">high</span>):
        <span class="var">mid</span> = (<span class="var">low</span> + <span class="var">high</span>) / <span class="val">2</span>
        <span class="kw">NẾU</span> (<span class="var">E</span>[<span class="var">mid</span>].<span class="var">T</span> <= <span class="var">X</span>) <span class="kw">THÌ</span>:
            <span class="var">k</span> = <span class="var">mid</span>
            <span class="var">low</span> = <span class="var">mid</span> + <span class="val">1</span>
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">high</span> = <span class="var">mid</span> - <span class="val">1</span>
            
    <span class="kw">TRẢ VỀ</span> <span class="var">E</span>[<span class="var">k</span>].<span class="var">P</span> + <span class="var">E</span>[<span class="var">k</span>].<span class="var">V</span> * (<span class="var">X</span> - <span class="var">E</span>[<span class="var">k</span>].<span class="var">T</span>)

<span class="com">// 3. Trả lời các Truy vấn O(Q log N)</span>
<span class="kw">LẶP</span> mỗi truy vấn (<span class="var">L</span>, <span class="var">R</span>):
    <span class="kw">XUẤT</span> <span class="fn">GetDist</span>(<span class="var">R</span>) - <span class="fn">GetDist</span>(<span class="var">L</span>)
</pre>

**Đánh giá:** Việc chuyển đổi từ không gian thời gian liên tục sang Không gian sự kiện rời rạc (Event-driven) là một trong những tư duy đỉnh cao nhất của lập trình thi đấu. Thời gian xây mảng sự kiện $O(N)$. Mỗi truy vấn chặt nhị phân tốn $O(\log N)$. Tổng thời gian $O(Q \log N)$. Ăn trọn 100% điểm và không sợ $T = 10^9$.
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: So sánh & Đánh giá 5 Subtask</div>
    
<p>Bài toán <b>Trò chơi LineDash</b> là một ví dụ mẫu mực về hành trình nâng cấp cấu trúc dữ liệu. Từ việc quan sát các công thức Vật lý/Toán học cơ bản, đến việc dùng bộ nhớ để lưu trữ thời gian, và cuối cùng là kỹ thuật <b>"Nhảy cóc" theo mốc sự kiện (Event-based)</b>. Dưới đây là bảng so sánh chi tiết:</p>

<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.85rem;">
            <thead>
                <tr>
                    <th style="width: 12%;">Tiêu chí</th>
                    <th style="width: 20%; background-color: #f97316; color: white;">1. Toán học O(1)<br>(Subtask 1)</th>
                    <th style="width: 20%; background-color: #22c55e; color: white;">2. Cắt đoạn O(1)<br>(Subtask 2)</th>
                    <th style="width: 24%; background-color: #3b82f6; color: white;">3. Cộng dồn từng giây<br>(Subtask 3 & 4)</th>
                    <th style="width: 24%; background-color: #a855f7; color: white;">4. Cộng dồn Sự kiện + Nhị phân<br>(Subtask 5)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng cốt lõi</td>
                    <td>Không có lệnh đổi hướng. Nhân vật luôn đi ngang với $V=1$.</td>
                    <td>Chỉ có 1 lệnh đổi hướng. Cắt thời gian $[L, R]$ thành các khúc trước và sau lệnh đổi hướng để tính.</td>
                    <td>Tạo mảng <code>dist[t]</code> mô phỏng quãng đường tại từng giây từ $0$ đến $T$. Dùng $dist[R] - dist[L]$.</td>
                    <td>Chỉ lưu tổng quãng đường tại các <b>mốc thời gian có lệnh</b> (Mảng <code>P[i]</code>). Dùng Tìm kiếm nhị phân để truy vấn.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td><b>$O(Q)$</b><br>(Trả lời $O(1)$ cho mỗi truy vấn)</td>
                    <td><b>$O(Q)$</b><br>(Dùng IF/ELSE kiểm tra $O(1)$)</td>
                    <td><b>$O(T + Q)$</b><br>Tốn $O(T)$ để xây dựng mảng.</td>
                    <td><b>$O(N + Q \log N)$</b><br>Mỗi truy vấn chặt nhị phân mất $O(\log N)$.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(1)$</td>
                    <td>$O(1)$</td>
                    <td>$O(T)$<br>(Cần mảng độ dài $T$)</td>
                    <td><b>$O(N)$</b><br>(Chỉ cần mảng độ dài $N$ sự kiện)</td>
                </tr>
                <tr>
                    <td class="td-label">Giới hạn qua test</td>
                    <td>N = 0</td>
                    <td>N = 1</td>
                    <td>T $\le 10^6$</td>
                    <td><b>100% Điểm (T $\le 10^9$)</b></td>
                </tr>
                <tr>
                    <td class="td-label">Bài học</td>
                    <td>Công thức $S = V \times t$. Nhận biết bài toán khi không có biến cố.</td>
                    <td>Kỹ năng biện luận các trường hợp giao nhau của 2 đoạn thẳng (đoạn thời gian).</td>
                    <td>Kỹ năng áp dụng <b>Mảng cộng dồn (Prefix Sum)</b> để trả lời truy vấn đoạn trong $O(1)$.</td>
                    <td>Chuyển đổi từ không gian tuyến tính sang <b>Không gian sự kiện (Event-driven)</b> để tiết kiệm bộ nhớ, kết hợp Binary Search.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>