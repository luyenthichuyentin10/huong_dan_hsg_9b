## √ Bài: Lập bảng (NSQUARE - HCM 2014-2015)

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một số nguyên dương $N$ ($1 \le N \le 10^{14}$).

**Yêu cầu:** Tìm số nguyên dương $K$ nhỏ nhất sao cho tích $N \times K$ là một **số chính phương** (Perfect Square).

**Ví dụ:**
- $N = 8$. Tí cần tìm $K$ nhỏ nhất để $8 \times K$ là số chính phương.
- Thử $K=1 \rightarrow 8 \times 1 = 8$ (không phải)
- Thử $K=2 \rightarrow 8 \times 2 = 16 = 4^2$ (Đúng!)
$\Rightarrow$ Kết quả: $K = 2$.
<div class="important-note">

**📌 Dạng bài:** Số học  
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Duyệt tìm số chính phương</div>

### 💡 Ý tưởng
- Gọi $A$ là số của Tí ($N$), $B$ là số của Tèo ($K$).
- Ta cần $A \times B = C$ (với $C$ là số chính phương nhỏ nhất).
- Suy ra $B = C / A$.
- Để $B$ nhỏ nhất thì $C$ phải nhỏ nhất.
- Do $C$ là số chính phương, nên $C = i^2$. Ta sẽ duyệt $i$ từ $1$ tăng dần. Số chính phương $C = i^2$ đầu tiên nào chia hết cho $A$ thì ta dừng lại và tính $B = C / A$.
- *Lưu ý:* Nếu $A$ là số nguyên tố thì $B = A$.

**Mã giả:**
<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">A</span>;
<span class="kw">CHO</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">A</span>:
    <span class="var">C</span> = <span class="var">i</span> * <span class="var">i</span>;
    <span class="kw">NẾU</span> (<span class="var">C</span> % <span class="var">A</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">B</span> = <span class="var">C</span> / <span class="var">A</span>;
        <span class="kw">XUẤT</span> <span class="var">B</span>;
        <span class="kw">THOÁT</span>;
</pre>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 2: Phân tích Thừa số Nguyên tố (Tối ưu)</div>

### 💡 Bản chất Toán học
Mọi số nguyên $N$ đều có thể phân tích thành tích các thừa số nguyên tố: $N = p_1^{a_1} \times p_2^{a_2} \times \dots \times p_m^{a_m}$

Một số được gọi là **số chính phương** khi và chỉ khi **tất cả các số mũ ($a_1, a_2, \dots, a_m$) đều là số chẵn**.
*Ví dụ:* $36 = 2^2 \times 3^2$ (chính phương vì mũ 2, mũ 2 đều chẵn).
*Ví dụ:* $8 = 2^3$ (không chính phương vì mũ 3 là lẻ).

### 💡 Ý tưởng thuật toán
Để $N \times K$ là số chính phương với $K$ nhỏ nhất, $K$ chỉ cần "bù" thêm đúng 1 thừa số nguyên tố cho những thừa số nào của $N$ đang có **số mũ lẻ**.
1. Khởi tạo $K = 1$.
2. Phân tích $N$ ra thừa số nguyên tố.
3. Với mỗi thừa số nguyên tố $p$ có số mũ lẻ, ta nhân $K = K \times p$.
4. Phần còn dư của $N$ (nếu $>1$) sau khi phân tích chắc chắn là một số nguyên tố có số mũ 1 (lẻ), nên ta nhân $K = K \times N$.

**Mã giả:**
<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>;
<span class="var">K</span> = <span class="val">1</span>;

<span class="kw">CHO</span> <span class="var">i</span> từ <span class="val">2</span> <span class="kw">ĐẾN</span> <span class="fn">SQRT</span>(<span class="var">N</span>):
    <span class="kw">NẾU</span> (<span class="var">N</span> % <span class="var">i</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">dem_mu</span> = <span class="val">0</span>;
        <span class="kw">TRONG KHI</span> (<span class="var">N</span> % <span class="var">i</span> == <span class="val">0</span>):
            <span class="var">dem_mu</span> = <span class="var">dem_mu</span> + <span class="val">1</span>;
            <span class="var">N</span> = <span class="var">N</span> / <span class="var">i</span>;
        
        <span class="kw">NẾU</span> (<span class="var">dem_mu</span> % <span class="val">2</span> != <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">K</span> = <span class="var">K</span> * <span class="var">i</span>; <span class="com">// Bù thêm để thành mũ chẵn</span>

<span class="kw">NẾU</span> (<span class="var">N</span> > <span class="val">1</span>) <span class="kw">THÌ</span> <span class="var">K</span> = <span class="var">K</span> * <span class="var">N</span>;

<span class="kw">XUẤT</span> <span class="var">K</span>;
</pre>
</div>

<div class="step-card border-green">
    <div class="step-badge bg-green">Bảng So sánh 2 Phương pháp</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 40%;">Cách 1: Duyệt số chính phương</th>
                    <th class="th-green" style="width: 40%;">Cách 2: Phân tích TSNT</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Kiến thức Toán học</td>
                    <td>Cơ bản (Định nghĩa phép chia hết và số chính phương).</td>
                    <td>Nâng cao (Định lý cơ bản của số học, tính chất số mũ).</td>
                </tr>
                <tr>
                    <td class="td-label">Độ khó code</td>
                    <td>Rất dễ (Chỉ dùng vòng lặp cơ bản).</td>
                    <td>Trung bình (Cần kết hợp vòng lặp <code class="inline-code">while</code> lồng trong <code class="inline-code">for</code>).</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp</td>
                    <td>$O(N)$ (Vòng lặp chạy tối đa $N$ lần).</td>
                    <td>$O(\sqrt{N})$ (Vòng lặp chạy tối đa $\sqrt{N}$ lần).</td>
                </tr>
                <tr>
                    <td class="td-label">Khả năng AC<br><small style="font-weight:normal; color:#64748b;">(Theo ràng buộc đề)</small></td>
                    <td class="td-warning">Đạt <b>50% số điểm</b> ($N \le 10^7$). Sẽ bị quá thời gian (TLE) với $N = 10^{14}$.</td>
                    <td class="td-optimal">Đạt <b>100% số điểm</b> ($\sqrt{10^{14}} = 10^7$ phép tính, chạy mượt mà trong 1s).</td>
                </tr>
                <tr>
                    <td class="td-label">Lưu ý kiểu dữ liệu</td>
                    <td>Cần dùng kiểu số nguyên cực lớn để lưu $C = i \times i$.</td>
                    <td>Chỉ cần xử lý số tối đa bằng $N$, vừa vặn trong kiểu <code class="inline-code">long long</code>.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>