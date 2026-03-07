## 🔳 Bài: Bảng vuông con lớn nhất (MAXTAB) 
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho bảng vuông các số nguyên không âm kích thước $N \times N$.

**Yêu cầu:** Tìm một **bảng vuông con** (kích thước $k \times k$) thỏa mãn:
1. Tất cả các phần tử bên trong bảng con đều phải là **số dương** (lớn hơn 0).
2. **Tổng** các phần tử trong bảng con này là lớn nhất.

<div class="important-note">

**📌 Dạng bài:** Quy hoạch động - prefix sum trên ma trận
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Dành cho N nhỏ)</div>

**💡 Phân tích thuật toán**

Duyệt qua tất cả các hình vuông con có thể có trong bảng. Với mỗi hình vuông con, ta kiểm tra xem có chứa số 0 nào không. Nếu không, ta tính tổng và cập nhật giá trị lớn nhất.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="var">max_sum</span> = <span class="val">0</span>;
<span class="kw">CHO</span> <span class="var">k</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>: <span class="com">// Thử mọi kích thước cạnh</span>
    <span class="kw">CHO</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N - k + 1</span>:
        <span class="kw">CHO</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N - k + 1</span>:
            <span class="var">hop_le</span> = <span class="kw">true</span>; <span class="var">tong_con</span> = <span class="val">0</span>;
            <span class="kw">CHO</span> <span class="var">r</span> từ <span class="var">i</span> <span class="kw">ĐẾN</span> <span class="var">i + k - 1</span>:
                <span class="kw">CHO</span> <span class="var">c</span> từ <span class="var">j</span> <span class="kw">ĐẾN</span> <span class="var">j + k - 1</span>:
                    <span class="kw">NẾU</span> (<span class="var">A[r][c]</span> == <span class="val">0</span>) <span class="kw">THÌ</span> <span class="var">hop_le</span> = <span class="kw">false</span>;
                    <span class="var">tong_con</span> += <span class="var">A[r][c]</span>;
            
            <span class="kw">NẾU</span> (<span class="var">hop_le</span> == <span class="kw">true</span>) <span class="kw">THÌ</span>
                <span class="var">max_sum</span> = <span class="fn">MAX</span>(<span class="var">max_sum</span>, <span class="var">tong_con</span>);
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Quy hoạch động & Prefix Sum (Tối ưu)</div>

**Giai đoạn 1. Ma trận cộng dồn (Prefix Sum 2D)**

Để tính tổng bảng con trong $O(1)$, ta xây dựng mảng $S[i][j]$ là tổng các phần tử từ $(1, 1)$ đến $(i, j)$ theo công thức
- Công thức tạo ma trận prefix sum:
<div class="math-formula">
$S[i][j] = A[i][j] + S[i-1][j] + S[i][j-1] - S[i-1][j-1]$
</div>

- Công thức tính tổng bảng con từ $(x_1, y_1)$ đến $(x_2, y_2)$:
<div class="math-formula">
$\text{Sum} = S[x_2][y_2] - S[x_1-1][y_2] - S[x_2][y_1-1] + S[x_1-1][y_1-1]$
</div>


**Giai đoạn 2. Tư duy Quy hoạch động xác định hình vuông con dương**

Ta cần biết nhanh một hình vuông con có chứa số $0$ hay không mà không cần dùng vòng lặp thứ $3$.

* **Bước 1: Ý nghĩa ma trận $DP[i][j]$ và bài toán cơ sở**
    - Gọi $DP[i][j]$ là **độ dài cạnh lớn nhất** của hình vuông con **toàn số dương** có góc dưới bên phải tại tọa độ $(i, j)$.
    - **Bài toán cơ sở:** Nếu $A[i][j] > 0$, thì $DP[i][j]$ tối thiểu bằng 1, ngược lại $DP[i][j] = 0$

* **Bước 2: Công thức truy hồi**
    -  Một hình vuông cạnh $k$ tại $(i, j)$ chỉ được hình thành nếu 3 ô lân cận của nó cũng là góc của các hình vuông dương.
<div class="math-formula">
$DP[i][j] = \begin{cases} \min(DP[i-1][j], DP[i][j-1], DP[i-1][j-1]) + 1 & \text{nếu } A[i][j] > 0 \\ 0 & \text{nếu } A[i][j] = 0 \end{cases}$
</div>

- Vì bảng con toàn số dương nên với mỗi ô $(i, j)$, hình vuông con có cạnh $k = DP[i][j]$ sẽ cho tổng lớn nhất tại vị trí đó. Ta không cần duyệt lại các cạnh nhỏ hơn $k$.
- Tại mỗi bài toán con trong quá trình *DP*, ta áp dụng công thức prefix sum tính diện tích hình vuông có tọa độ trái trên $[i-k][j-k]$ và tọa độ phải dưới $[i][j]$
- So sánh và cập nhật **max**

**Mã giả thuật toán**
<pre class="pseudocode">
<span class="var">max_sum</span> = <span class="val">0</span>;
<span class="kw">Duyệt</span> <span class="var">i, j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="com">// 1. Cập nhật Prefix Sum</span>
    <span class="var">S[i][j]</span> = <span class="var">A[i][j]</span> + <span class="var">S[i-1][j]</span> + <span class="var">S[i][j-1]</span> - <span class="var">S[i-1][j-1]</span>;
    
    <span class="com">// 2. Cập nhật DP cạnh lớn nhất</span>
    <span class="kw">NẾU</span> (<span class="var">A[i][j]</span> > <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">DP[i][j]</span> = <span class="fn">min</span>(<span class="var">DP[i-1][j]</span>, <span class="var">DP[i][j-1]</span>, <span class="var">DP[i-1][j-1]</span>) + <span class="val">1</span>;
        
        <span class="com">// 3. Tính tổng hình vuông lớn nhất tại (i, j) và cập nhật kết quả</span>
        <span class="var">k</span> = <span class="var">DP[i][j]</span>;
        <span class="var">x1</span> = <span class="var">i-k+1</span>; <span class="var">y1</span> = <span class="var">j-k+1</span>;
        <span class="var">tong</span> = <span class="var">S[i][j]</span> - <span class="var">S[x1-1][j]</span> - <span class="var">S[i][y1-1]</span> + <span class="var">S[x1-1][y1-1]</span>;
        <span class="var">max_sum</span> = <span class="fn">MAX</span>(<span class="var">max_sum</span>, <span class="var">tong</span>);
    <span class="kw">NGƯỢC LẠI</span> <span class="var">DP[i][j]</span> = <span class="val">0</span>;

<span class="kw">XUẤT</span> <span class="var">max_sum</span>;
</pre>
</div>