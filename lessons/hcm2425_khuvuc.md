## 📍 Bài 2: Khu Vực (KHUVUC - HCM 2024-2025)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích bản chất Toán học</div>

**Giải mã yêu cầu:**
- Mỗi người có 1 thẻ ghi số $a_i$. Được phép vào khu vực có số thứ tự là ƯỚC SỐ của số thẻ.
- Tất cả người dân tập trung về 1 khu vực $\Rightarrow$ Số thứ tự khu vực đó phải là **ƯỚC CHUNG** của tất cả các $a_i$.
- Trưởng lão muốn khu vực có số thứ tự lớn nhất $\Rightarrow$ Đây chính là **Ước chung lớn nhất (GCD)** của cả mảng.
- **Biến cố:** Trưởng lão đổi 1 thẻ thành số bất kỳ để khu vực mới có GCD lớn hơn. 

Thẻ mới có thể được chọn tùy ý (ví dụ: bằng luôn với GCD của các thẻ còn lại). 

$\Rightarrow$ Tóm lại, bài toán yêu cầu: **Loại bỏ chính xác 1 phần tử trong mảng sao cho GCD của các phần tử còn lại là lớn nhất.**
<div class="important-note">

**📌 Dạng bài:** Toán - ước chung lớn nhất - prefix suffix
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1 & 2: Vét cạn (Subtask 1 và 2: N ≤ 1000)</div>

### 💡 Ý tưởng Subtask 1 & 2 (80% Điểm)
Với $N \le 1000$, ta có thể dùng phương pháp Vét cạn (Brute-force): 
Lần lượt thử loại bỏ từng người (từ người số $1$ đến người thứ $N$). Với mỗi người bị loại, ta dùng 1 vòng lặp để tính GCD của $N - 1$ người còn lại. Lưu lại GCD lớn nhất tìm được.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">GCD</span>(<span class="var">a</span>, <span class="var">b</span>):
    <span class="kw">NẾU</span> (<span class="var">b</span> == <span class="val">0</span>) <span class="kw">TRẢ VỀ</span> <span class="var">a</span>
    <span class="kw">TRẢ VỀ</span> <span class="fn">GCD</span>(<span class="var">b</span>, <span class="var">a</span> % <span class="var">b</span>)

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="var">Max_GCD</span> = <span class="val">0</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">Current_GCD</span> = <span class="val">0</span>
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="kw">NẾU</span> (<span class="var">j</span> ≠ <span class="var">i</span>) <span class="kw">THÌ</span>:
            <span class="var">Current_GCD</span> = <span class="fn">GCD</span>(<span class="var">Current_GCD</span>, <span class="var">A</span>[<span class="var">j</span>])
            
    <span class="var">Max_GCD</span> = <span class="fn">MAX</span>(<span class="var">Max_GCD</span>, <span class="var">Current_GCD</span>)

<span class="kw">XUẤT</span> <span class="var">Max_GCD</span>
</pre>
**Đánh giá:** Thời gian chạy là $O(N^2 \log(\max A))$. Với Subtask 2 ($N = 1000$), số phép tính khoảng $10^6 \times \log(10^9)$, vẫn chạy rất mượt trong 1 giây để lấy 80% điểm. Nhưng nếu $N = 10^5$ (Subtask 3), $O(N^2)$ sẽ tốn $10^{10}$ phép tính và bị TLE!
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 3: Mảng tiền tố & Hậu tố (Subtask 3 - 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu (Prefix GCD & Suffix GCD)
Khi ta loại bỏ phần tử $A[i]$, phần còn lại của mảng bị chia làm 2 đoạn:
1. Đoạn bên trái: Từ $A[1]$ đến $A[i-1]$.
2. Đoạn bên phải: Từ $A[i+1]$ đến $A[N]$.

Để không phải tính lại GCD của hai đoạn này bằng vòng lặp, ta có thể **tiền xử lý (Precompute)** chúng:
- Xây dựng mảng `Pref[i]` là Ước chung lớn nhất của các số từ trái qua phải (từ $A[1]$ đến $A[i]$).
- Xây dựng mảng `Suff[i]` là Ước chung lớn nhất của các số từ phải qua trái (từ $A[N]$ lùi về $A[i]$).

Khi loại bỏ $A[i]$, GCD của mảng còn lại chỉ đơn giản là ghép kết quả của mảng trái và mảng phải:
**$\text{GCD còn lại} = \text{GCD}(Pref[i-1], Suff[i+1])$** (Chỉ tốn $O(1)$).

### ❓ Giải thích chi tiết
**Tại sao đổi 1 thẻ lại tương đương với Loại bỏ thẻ đó:** 
- Giả sử mảng ban đầu có $N$ phần tử. Ta quyết định đổi thẻ $A[i]$ thành một con số $X$ bất kỳ.
    - Gọi $G_{rest}$ là Ước chung lớn nhất (GCD) của $N-1$ thẻ còn lại (không tính $A[i]$).
    - Sau khi đổi $A[i]$ thành $X$, GCD của toàn bộ khu vực lúc này sẽ là: $GCD_{new} = GCD(G_{rest}, X)$.
- **Mục tiêu của ta là làm cho $GCD_{new}$ đạt giá trị LỚN NHẤT có thể.**
    - Theo tính chất toán học, ước chung của hai số không bao giờ lớn hơn chính bản thân các số đó. Tức là $GCD_{new} \le G_{rest}$.
    - Vậy để $GCD_{new}$ đạt giá trị tối đa (bằng chính $G_{rest}$), trưởng lão chỉ việc chọn một thẻ mới $X$ sao cho $X$ chia hết cho $G_{rest}$ (hoặc chọn $X$ bằng luôn $G_{rest}$).
    - **$\Rightarrow$ Kết luận:** Giá trị khu vực lớn nhất sau khi đổi thẻ $i$ chính là bằng GCD của tất cả các thẻ còn lại (ngoại trừ thẻ $i$). Ta hoàn toàn có thể xem như thẻ $i$ bị "xóa sổ" khỏi mảng khi tính toán.

**Kỹ thuật Mảng Tiền tố (Pref) và Hậu tố (Suff):**
- Nếu dùng vòng lặp vét cạn để tính GCD của $N-1$ phần tử còn lại cho mỗi vị trí $i$, ta sẽ tốn $O(N^2)$. Kỹ thuật Pref và Suff giúp ta làm việc này chỉ trong $O(1)$.
    - `Pref[i]`: Lưu GCD của tất cả các phần tử từ đầu mảng đến vị trí $i$.
    - `Suff[i]`: Lưu GCD của tất cả các phần tử từ cuối mảng lùi về vị trí $i$.
- Khi ta "che" (loại bỏ) đi phần tử $A[i]$, mảng bị đứt làm 2 khúc:
    - Khúc bên trái: Từ $1$ đến $i-1$. GCD của khúc này chính là Pref[i-1].
    - Khúc bên phải: Từ $i+1$ đến $N$. GCD của khúc này chính là Suff[i+1].
- $\Rightarrow$ Thay vì duyệt lại từ đầu, ta chỉ cần gộp 2 khúc này lại: $GCD_{rest} = GCD(Pref[i-1], Suff[i+1])$.

**Ví dụ minh họa từng bước (Test case trong đề)** Xét mảng ví dụ: $A = [4, 2, 8]$ với $N = 3$.
- **Bước 1: Khởi tạo mảng Tiền tố (Pref) tính từ Trái qua Phải:**
    - Pref[1] = $4$
    - Pref[2] = $GCD(Pref[1], A[2]) = GCD(4, 2) = \mathbf{2}$
    - Pref[3] = $GCD(Pref[2], A[3]) = GCD(2, 8) = \mathbf{2}$
    - **Mảng Pref:** [4, 2, 2]
- **Bước 2: Khởi tạo mảng Hậu tố (Suff) tính từ Phải qua Trái:**
    - Suff[3] = $8$
    - Suff[2] = $GCD(Suff[3], A[2]) = GCD(8, 2) = \mathbf{2}$
    - Suff[1] = $GCD(Suff[2], A[1]) = GCD(2, 4) = \mathbf{2}$
    - **Mảng Suff:** [2, 2, 8]
- **Bước 3: Thử loại bỏ từng phần tử $i$ để tìm Max GCD** (Lưu ý: Để tránh lỗi vượt quá mảng, ta quy ước Pref[0] = 0 và Suff[N+1] = 0. Vì $GCD(x, 0) = x$)
    - **Khi $i = 1$ (Che số 4):**
        - Bên trái không có gì (Pref[0] = 0).
        - Bên phải từ vị trí 2 trở đi: Suff[2] = 2.
        - $GCD$ còn lại = $GCD(0, 2) = \mathbf{2}$.
    - **Khi $i = 2$ (Che số 2):**
        - Khúc bên trái (vị trí 1): Pref[1] = 4.
        - Khúc bên phải (vị trí 3): Suff[3] = 8.
        - $GCD$ còn lại = $GCD(4, 8) = \mathbf{4}$.
    - **Khi $i = 3$ (Che số 8):**
        - Khúc bên trái (vị trí 1 và 2): Pref[2] = 2.
        - Bên phải không có gì (Suff[4] = 0).
        - $GCD$ còn lại = $GCD(2, 0) = \mathbf{2}$.
- **Kết quả cuối cùng:** So sánh các giá trị tìm được $(2, 4, 2)$, giá trị lớn nhất là $4$.Đáp án này hoàn toàn khớp với giải thích trong đề: "đổi thẻ số 2 thành thẻ số 4... chọn được khu vực có số thứ tự lớn hơn là 4".

<pre class="pseudocode">
<span class="var">Pref</span> = <span class="fn">Mang</span>(N + 2, <span class="val">0</span>)
<span class="var">Suff</span> = <span class="fn">Mang</span>(N + 2, <span class="val">0</span>)

<span class="com">// 1. Xây dựng mảng Prefix (Trái -> Phải)</span>
<span class="var">Pref</span>[<span class="val">1</span>] = <span class="var">A</span>[<span class="val">1</span>]
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">2</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">Pref</span>[<span class="var">i</span>] = <span class="fn">GCD</span>(<span class="var">Pref</span>[<span class="var">i</span> - <span class="val">1</span>], <span class="var">A</span>[<span class="var">i</span>])

<span class="com">// 2. Xây dựng mảng Suffix (Phải -> Trái)</span>
<span class="var">Suff</span>[<span class="var">N</span>] = <span class="var">A</span>[<span class="var">N</span>]
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">N</span> - <span class="val">1</span> <span class="kw">GIẢM VỀ</span> <span class="val">1</span>:
    <span class="var">Suff</span>[<span class="var">i</span>] = <span class="fn">GCD</span>(<span class="var">Suff</span>[<span class="var">i</span> + <span class="val">1</span>], <span class="var">A</span>[<span class="var">i</span>])

<span class="com">// 3. Tìm Max GCD khi bỏ đi từng phần tử</span>
<span class="var">Max_GCD</span> = <span class="val">0</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">Current_GCD</span> = <span class="fn">GCD</span>(<span class="var">Pref</span>[<span class="var">i</span> - <span class="val">1</span>], <span class="var">Suff</span>[<span class="var">i</span> + <span class="val">1</span>])  <span class="com">// Ghi chú: Pref[0] = Suff[N+1] = 0</span>
    <span class="var">Max_GCD</span> = <span class="fn">MAX</span>(<span class="var">Max_GCD</span>, <span class="var">Current_GCD</span>)

<span class="kw">XUẤT</span> <span class="var">Max_GCD</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 25%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 35%;">Vét cạn (Brute-force)</th>
                    <th class="th-green" style="width: 40%;">Tiền tố & Hậu tố (Prefix/Suffix)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N^2 \log(\max A))$</td>
                    <td><b>$O(N \log(\max A))$</b><br>Xây 2 mảng $O(N)$, truy vấn $N$ lần $O(1)$. Nhanh gấp hàng vạn lần.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(1)$</td>
                    <td>$O(N)$ (Cần thêm mảng lưu Pref và Suff). Rất an toàn.</td>
                </tr>
                <tr>
                    <td class="td-label">Bản chất Tối ưu</td>
                    <td>Tính đi tính lại nhiều lần sự kết hợp GCD của các phần tử giống nhau.</td>
                    <td>Ghi nhớ (Cache) trạng thái GCD cộng dồn từ 2 đầu mảng lại. Tránh hoàn toàn việc tính lặp.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>