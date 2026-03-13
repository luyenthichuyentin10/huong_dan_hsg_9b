## 🎰 Bài 3: Xổ số (XOSO - HCM 2022-2023)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho mảng $X$ gồm $N$ phần tử. Ta cần chọn ra đúng $K$ phần tử.

**Điểm thưởng** của một cách chọn là giá trị **lớn nhất (Max)** trong $K$ phần tử đó.

**Yêu cầu:** Tính tổng điểm thưởng của **TẤT CẢ** các cách chọn $K$ phần tử có thể có. Kết quả chia lấy dư cho $10^9 + 7$.

**Ví dụ:** $N=4, K=2$, mảng `[6, 7, 6, 5]`. Tổng các max của 6 cách chọn là 39.
<div class="important-note">

**📌 Dạng bài:** Toán tập hợp - tư duy ngược
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Subtask 1: N ≤ 1000, K ≤ 3)</div>

### 💡 Ý tưởng Subtask 1
Vì $K$ rất nhỏ ($K \in \{1, 2, 3\}$), ta có thể dùng trực tiếp các vòng lặp lồng nhau để tạo ra mọi tổ hợp. 
- Nếu $K=1$: Nên tổng các cách chọn là tổng các phần tử trong mảng A $\rightarrow$ dùng 1 vòng lặp.
- Nếu $K=2$: Dùng 2 vòng lặp lồng nhau.
- Nếu $K=3$: Dùng 3 vòng lặp lồng nhau.
Bên trong vòng lặp trong cùng, ta tìm giá trị Max và cộng vào tổng.

<pre class="pseudocode">
<span class="var">MOD</span> = <span class="val">1000000007</span>
<span class="var">Sum</span> = <span class="val">0</span>
<span class="kw">NẾU</span> (<span class="var">K</span> == <span class="val">2</span>) <span class="kw">THÌ</span>:
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="val">1</span>:
        <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="var">i</span> + <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
            <span class="var">Max_val</span> = <span class="fn">MAX</span>(<span class="var">X</span>[<span class="var">i</span>], <span class="var">X</span>[<span class="var">j</span>])
            <span class="var">Sum</span> = (<span class="var">Sum</span> + <span class="var">Max_val</span>) % <span class="var">MOD</span>
</pre>
**Đánh giá:** Nếu $K=3$, số phép tính khoảng $\frac{N^3}{6}$. Với $N=1000$, $\frac{10^9}{6} \approx 1.6 \times 10^8$, vẫn chạy xấp xỉ trong 1 giây. Thuật toán này giành được 30% điểm.
</div>

<div class="step-card border-yellow">
<div class="step-badge bg-yellow">Cách 2: Quay lui sinh Tổ hợp (Subtask 2: N ≤ 25, K ≤ 12)</div>

### 💡 Ý tưởng Subtask 2
Lúc này $K$ có thể lên đến 12, ta không thể viết 12 vòng lặp lồng nhau. Thay vào đó, ta dùng thuật toán **Quay lui (Backtracking)** để duyệt qua mọi tổ hợp chập $K$ của $N$.
Với $N=25, K=12$, số tổ hợp lớn nhất là $C_{25}^{12} \approx 5.2 \times 10^6$. Việc sinh ra $5.2$ triệu mảng con và tìm Max hoàn toàn chạy tốt trong 1 giây.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">SinhToHop</span>(<span class="var">idx</span>, <span class="var">so_luong_da_chon</span>, <span class="var">max_hien_tai</span>):
    <span class="kw">NẾU</span> (<span class="var">so_luong_da_chon</span> == <span class="var">K</span>) <span class="kw">THÌ</span>:
        <span class="var">Sum</span> = (<span class="var">Sum</span> + <span class="var">max_hien_tai</span>) % <span class="var">MOD</span>
        <span class="kw">TRẢ VỀ</span>
        
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">idx</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="var">max_moi</span> = <span class="fn">MAX</span>(<span class="var">max_hien_tai</span>, <span class="var">X</span>[<span class="var">i</span>])
        <span class="fn">SinhToHop</span>(<span class="var">i</span> + <span class="val">1</span>, <span class="var">so_luong_da_chon</span> + <span class="val">1</span>, <span class="var">max_moi</span>)
</pre>
**Đánh giá:** Thuật toán này giúp lấy thêm 20% điểm. Nhưng nếu đem chạy với $N=10^5$, chương trình sẽ treo vĩnh viễn.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 3: Sắp xếp & Toán Tổ Hợp (Subtask 3 - 100% Điểm)</div>

***Cho dãy A có N phần tử, lấy ra K phần tử không phân biệt thứ tự nên đây là bài toán tổ hợp***

### 💡 Ý tưởng Tối ưu (Bước ngoặt tư duy)
Thay vì sinh tập hợp rồi mới đi tìm Max, ta hãy **SẮP XẾP mảng tăng dần**. Sau khi sắp xếp, hãy thử lấy một phần tử $X[i]$ và ép nó phải làm Max.
- Để $X[i]$ là phần tử lớn nhất trong tập $K$ phần tử, thì $(K - 1)$ phần tử còn lại bắt buộc phải được chọn từ các phần tử nhỏ hơn hoặc bằng nó.
- Có bao nhiêu phần tử nhỏ hơn nó? Vì mảng đã sắp xếp tăng dần, nên các phần tử từ $X[1]$ đến $X[i-1]$ (có chính xác $i-1$ phần tử) đều $\le X[i]$.
- Vậy số lượng tập hợp chập $K$ nhận $X[i]$ làm Max chính là số cách chọn $K-1$ phần tử từ $i-1$ phần tử. Theo toán học, đó là **Tổ hợp chập $K-1$ của $i-1$**, ký hiệu: $C_{i-1}^{K-1}$.

**Công thức quy hoạch bài toán:**
$$Tổng = \sum_{i=K}^{N} \Big( X[i] \times C_{i-1}^{K-1} \Big) \pmod{10^9+7}$$

**Ví dụ:** Xét mảng $A = {6, 7, 6, 5}$ có $N = 4$, $K = 2$
- Sắp xếp mảng $A$ giảm dần $A = {7, 6, 6, 5}$
- Đầu tiên ta lấy $7$ bắt cặp với tổ hợp của $3$ chặp $1$
    - 7 6
    - 7 6
    - 7 5
    - Tổng tính được là $7*3 = 21$
- Tiếp theo ta lấy $6$ bắt cặp với tổ hợp của $2$ chặp $1$
    - 6 6
    - 6 5
    - Tổng tính được là $6*2 = 12$
- Tiếp theo ta lấy $6$ bắt cặp với tổ hợp của $1$ chặp $1$
    - 6 5
    - Tổng tính được là $6*1 = 6$
- **Tổng tất cả bằng $21 + 12 + 6 = 39$**

**Cách tính nhanh Tổ hợp $C_n^k$:**

Vì $K \le 50$, ta hoàn toàn có thể xây dựng **Tam giác Pascal** bằng Quy hoạch động $O(N \times K)$ trước khi tính toán. $C[n][k] = (C[n-1][k-1] + C[n-1][k]) \pmod{MOD}$.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">K</span>
<span class="kw">NHẬP</span> mảng <span class="var">X</span>

<span class="com">// 1. Tiền xử lý Tam giác Pascal để tính C(n, k)</span>
<span class="var">C</span> = <span class="fn">MaTran</span>(N, K)
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="val">1</span>:
    <span class="var">C</span>[<span class="var">i</span>][<span class="val">0</span>] = <span class="val">1</span>
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="fn">MIN</span>(<span class="var">i</span>, <span class="var">K</span> - <span class="val">1</span>):
        <span class="var">C</span>[<span class="var">i</span>][<span class="var">j</span>] = (<span class="var">C</span>[<span class="var">i</span>-<span class="val">1</span>][<span class="var">j</span>-<span class="val">1</span>] + <span class="var">C</span>[<span class="var">i</span>-<span class="val">1</span>][<span class="var">j</span>]) % <span class="var">MOD</span>

<span class="com">// 2. Sắp xếp mảng X tăng dần</span>
<span class="fn">Sap_Xep_Tang_Dan</span>(<span class="var">X</span>)

<span class="var">Sum</span> = <span class="val">0</span>
<span class="com">// 3. Duyệt mảng, ép X[i] làm Max</span>
<span class="com">// (Lưu ý mảng X xét từ chỉ số 0 đến N-1)</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">K</span> - <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="val">1</span>:
    <span class="var">So_Tap_Hop</span> = <span class="var">C</span>[<span class="var">i</span>][<span class="var">K</span>-<span class="val">1</span>]
    <span class="var">Sum</span> = (<span class="var">Sum</span> + <span class="var">X</span>[<span class="var">i</span>] * <span class="var">So_Tap_Hop</span>) % <span class="var">MOD</span>

<span class="kw">XUẤT</span> <span class="var">Sum</span>
</pre>
</div>

<div class="step-card border-purple">
<div class="step-badge bg-purple">Cách 4 (Nâng cao): Tổ Hợp bằng Nghịch Đảo Modulo (Chuẩn thi QG)</div>

### 💡 Ôn tập: Nghịch đảo Modulo
Nếu $K$ rất lớn, ta không thể dùng Tam giác Pascal $O(N \times K)$. Ta phải dùng công thức gốc của tổ hợp:
$$C_n^k = \frac{n!}{k! \times (n-k)!}$$

**Vấn đề:** Trong toán học Modulo, ta **KHÔNG ĐƯỢC thực hiện phép chia trực tiếp** (ví dụ $\frac{A}{B} \pmod M$). Thay vào đó, ta phải nhân với "Nghịch đảo modulo" của mẫu số: 
$$\frac{A}{B} \pmod M = A \times B^{-1} \pmod M$$

**Định lý Fermat nhỏ:** Vì $M = 10^9 + 7$ là một số nguyên tố, nghịch đảo modulo của $B$ chính là $B^{M-2} \pmod M$.
$$\Rightarrow C_n^k = n! \times (k!)^{M-2} \times ((n-k)!)^{M-2} \pmod M$$

**Thuật toán tối ưu $O(N \log M)$:**
1. Tiền xử lý: Dùng $O(N)$ để tính sẵn mảng Giai thừa `F[i]` (Lưu ý: Tính xong nhớ `% MOD`).
2. Viết hàm **Lũy thừa nhanh (Binary Exponentiation)** để tính $B^{M-2} \pmod M$ trong thời gian chỉ $O(\log M)$.
3. Tính $C_n^k$ bất kỳ chỉ trong $O(\log M)$ thay vì $O(N)$.

<pre class="pseudocode">
<span class="var">MOD</span> = <span class="val">1000000007</span>

<span class="com">// 1. Hàm Lũy thừa nhanh tính (a^b % MOD)</span>
<span class="kw">HÀM</span> <span class="fn">LuyThua</span>(<span class="var">a</span>, <span class="var">b</span>):
    <span class="var">res</span> = <span class="val">1</span>
    <span class="var">a</span> = <span class="var">a</span> % <span class="var">MOD</span>
    <span class="kw">LẶP TRONG KHI</span> (<span class="var">b</span> > <span class="val">0</span>):
        <span class="kw">NẾU</span> (<span class="var">b</span> % <span class="val">2</span> == <span class="val">1</span>) <span class="kw">THÌ</span> <span class="var">res</span> = (<span class="var">res</span> * <span class="var">a</span>) % <span class="var">MOD</span>
        <span class="var">a</span> = (<span class="var">a</span> * <span class="var">a</span>) % <span class="var">MOD</span>
        <span class="var">b</span> = <span class="var">b</span> / <span class="val">2</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">res</span>

<span class="com">// 2. Hàm tính Tổ hợp dùng Nghịch đảo</span>
<span class="kw">HÀM</span> <span class="fn">Tinh_C</span>(<span class="var">n</span>, <span class="var">k</span>, <span class="var">F</span>):
    <span class="kw">NẾU</span> (<span class="var">k</span> < <span class="val">0</span> <span class="kw">HOẶC</span> <span class="var">k</span> > <span class="var">n</span>) <span class="kw">THÌ TRẢ VỀ</span> <span class="val">0</span>
    <span class="var">Tu_so</span> = <span class="var">F</span>[<span class="var">n</span>]
    <span class="var">Mau_so_1</span> = <span class="fn">LuyThua</span>(<span class="var">F</span>[<span class="var">k</span>], <span class="var">MOD</span> - <span class="val">2</span>)
    <span class="var">Mau_so_2</span> = <span class="fn">LuyThua</span>(<span class="var">F</span>[<span class="var">n</span> - <span class="var">k</span>], <span class="var">MOD</span> - <span class="val">2</span>)
    
    <span class="var">Ket_qua</span> = (<span class="var">Tu_so</span> * <span class="var">Mau_so_1</span>) % <span class="var">MOD</span>
    <span class="var">Ket_qua</span> = (<span class="var">Ket_qua</span> * <span class="var">Mau_so_2</span>) % <span class="var">MOD</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">Ket_qua</span>

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">K</span>, mảng <span class="var">X</span>
<span class="fn">Sap_Xep_Giam_Dan</span>(<span class="var">X</span>)

<span class="com">// Tiền xử lý mảng Giai thừa O(N)</span>
<span class="var">F</span> = <span class="fn">Mang</span>(N + 1)
<span class="var">F</span>[<span class="val">0</span>] = <span class="val">1</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">F</span>[<span class="var">i</span>] = (<span class="var">F</span>[<span class="var">i</span>-<span class="val">1</span>] * <span class="var">i</span>) % <span class="var">MOD</span>

<span class="var">Sum</span> = <span class="val">0</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="var">K</span>:
    <span class="var">max_val</span> = <span class="var">X</span>[<span class="var">i</span>]
    <span class="var">n_pool</span> = <span class="var">N</span> - <span class="val">1</span> - <span class="var">i</span>
    <span class="var">k_need</span> = <span class="var">K</span> - <span class="val">1</span>
    
    <span class="var">combinations</span> = <span class="fn">Tinh_C</span>(<span class="var">n_pool</span>, <span class="var">k_need</span>, <span class="var">F</span>)
    <span class="var">Sum</span> = (<span class="var">Sum</span> + <span class="var">max_val</span> * <span class="var">combinations</span>) % <span class="var">MOD</span>

<span class="kw">XUẤT</span> <span class="var">Sum</span>
</pre>
</div>

<div class="step-card border-red">
    <div class="step-badge bg-red">Tổng kết: So sánh 3 Chiến thuật Giải bài toán Tổ hợp</div>
    
<p>Bài toán <b>Xổ số (XOSO)</b> là một ví dụ kinh điển để thấy sự tiến hóa của thuật toán theo độ lớn của dữ liệu đầu vào. Dưới đây là bảng so sánh 3 cấp độ giải quyết bài toán này:</p>

<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 15%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 25%;">1. Sinh Đệ quy (Quay lui)</th>
                    <th class="th-green" style="width: 30%;">2. Quy hoạch động (Tam giác Pascal)</th>
                    <th class="th-purple" style="width: 30%;">3. Nghịch đảo Modulo (Toán học)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng cốt lõi</td>
                    <td>Duyệt tạo ra mọi tổ hợp có thể có, tìm Max của từng tổ hợp rồi cộng lại.</td>
                    <td>Sắp xếp mảng. Cố định Max, số cách chọn phần còn lại là $C_n^k$. Tính $C_n^k$ bằng công thức cộng: $C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$.</td>
                    <td>Sắp xếp mảng. Cố định Max. Tính $C_n^k = \frac{n!}{k!(n-k)!}$ bằng Lũy thừa nhanh và Định lý Fermat nhỏ.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(C_N^K)$<br>(Cấp số mũ)</td>
                    <td>$O(N \times K + N \log N)$<br>(Thời gian lập bảng DP + Sắp xếp)</td>
                    <td>$O(N \log M + N \log N)$<br>($M$ là modulo $10^9+7$)</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(K)$<br>(Chỉ tốn bộ nhớ cho mảng tạm và stack đệ quy)</td>
                    <td>$O(N \times K)$<br>(Rất tốn RAM để lưu bảng 2 chiều)</td>
                    <td>$O(N)$<br>(Chỉ cần 1 mảng 1 chiều lưu Giai thừa)</td>
                </tr>
                <tr>
                    <td class="td-label">Giới hạn qua test (N, K)</td>
                    <td>Rất nhỏ<br>($N \le 25, K \le 12$)</td>
                    <td>$N$ lớn, nhưng $K$ phải nhỏ<br>($N \le 10^5, K \le 50$)</td>
                    <td><b>Tuyệt đối tối ưu</b><br>($N \le 10^5, K \le 10^5$)</td>
                </tr>
                <tr>
                    <td class="td-label">Ưu điểm</td>
                    <td>Dễ nghĩ, dễ code, trực quan nhất. Phù hợp vét cạn lấy điểm lẻ.</td>
                    <td>Không cần biết kiến thức Toán cao cấp. Chỉ dùng vòng lặp cộng và chia dư thông thường. Tránh được phép chia.</td>
                    <td>Thời gian và bộ nhớ cực kỳ nhỏ. Bất chấp mọi test ác ý (ví dụ $K = 50.000$).</td>
                </tr>
                <tr>
                    <td class="td-label">Nhược điểm</td>
                    <td>Chạy siêu chậm. Bị TLE (quá thời gian) ngay khi $N > 30$.</td>
                    <td>Sẽ bị MLE (Tràn bộ nhớ) hoặc TLE nếu $K$ lớn (Ví dụ $K = 50.000 \rightarrow$ Bảng DP cần $10^5 \times 50.000$ ô $\approx$ 20GB RAM).</td>
                    <td>Cần kiến thức Toán học chuyên sâu: Hàm Lũy thừa nhanh, Số học Modulo. Dễ code sai nếu không vững phép toán dư.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>