## ∥ Bài: Đường thẳng (STRAIGHT - HCM 2015-2016)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho $N$ điểm trên mặt phẳng tọa độ ($2 \le N \le 200$), mỗi điểm có tọa độ nguyên $X_i, Y_i$ ($-1000 \le X_i, Y_i \le 1000$). Bờm vẽ các đường thẳng đi qua 2 điểm bất kỳ trong số $N$ điểm đó. 

**Luật chơi:** Không được vẽ một đường thẳng nếu nó **song song** với một đường thẳng đã vẽ trước đó.

**Yêu cầu:** Tìm số đường thẳng tối đa Bờm có thể vẽ.

**Bản chất Hình học:**
- Hai đường thẳng song song (hoặc trùng nhau) khi và chỉ khi chúng có cùng **độ dốc (hệ số góc)**.
- Do đó, bài toán thực chất yêu cầu: Trong tất cả các đoạn thẳng nối 2 điểm bất kỳ, có bao nhiêu **độ dốc phân biệt**?
<div class="important-note">

**📌 Dạng bài:** Hình học, phân số tối giản (GCD) 
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Sai lầm thường gặp của học sinh</div>

Nhiều học sinh sẽ dùng công thức $m = \frac{Y_2 - Y_1}{X_2 - X_1}$ và lưu vào kiểu `float` hoặc `double` để so sánh.
- **Lỗi 1 (Sai số):** Máy tính lưu số thực không chính xác tuyệt đối. Hai độ dốc thực chất bằng nhau nhưng máy tính có thể hiểu là $0.333333333$ và $0.333333334$, dẫn đến đếm sai.
- **Lỗi 2 (Chia cho 0):** Nếu hai điểm nằm trên cùng một đường dọc ($X_1 = X_2$), phép chia sẽ gây lỗi chương trình (Runtime Error).
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Giải pháp Tối ưu: Phân số tối giản & Ước chung lớn nhất (GCD)</div>

### 📐 Tính chất toán
1. **Ý nghĩa của dx và dy**
    - Giả sử ta có hai điểm $A(x_1, y_1)$ và $B(x_2, y_2)$ trên mặt phẳng tọa độ. Khi vẽ một đoạn thẳng nối từ $A$ đến $B$, ta có thể tách sự di chuyển này thành 2 thành phần:
        - $dx$ (Delta X): Là bước đi theo chiều ngang (trục hoành). Công thức: $dx = x_2 - x_1$. Nó cho biết từ $A$ đến $B$, ta phải tiến hay lùi bao nhiêu bước theo phương ngang.
        - $dy$ (Delta Y): Là bước đi theo chiều dọc (trục tung). Công thức: $dy = y_2 - y_1$. Nó cho biết từ $A$ đến $B$, ta phải lên cao hay xuống thấp bao nhiêu bước.
2. **Tỷ số dy/dx có ý nghĩa**
    - Trong toán học, tỷ số $m = \frac{dy}{dx}$ được gọi là Độ dốc hay Hệ số góc (Slope) của đường thẳng.
    - Nó mang ý nghĩa thực tế là: Cứ tiến tới 1 đơn vị theo chiều ngang ($X$), đường thẳng sẽ nhích lên (hoặc chúi xuống) bao nhiêu đơn vị theo chiều dọc ($Y$)?
        - Ví dụ 1: Nếu $\frac{dy}{dx} = \frac{2}{1} = 2$. Nghĩa là cứ đi ngang 1 bước, đường thẳng vút lên cao 2 bước. Đây là một con dốc rất đứng.
        - Ví dụ 2: Nếu $\frac{dy}{dx} = \frac{-1}{3}$. Nghĩa là cứ đi ngang 3 bước, đường thẳng mới chúi xuống 1 bước. Đây là một con dốc lài lài đi xuống.
3. **Tính chất cốt lõi:** Hai đường thẳng SONG SONG (hoặc trùng nhau) khi và chỉ khi chúng có độ nghiêng y hệt nhau. Tức là tỷ số $\frac{dy}{dx}$ của chúng phải bằng nhau tuyệt đối. Nếu tỷ số này khác nhau dù chỉ một chút xíu, hai đường thẳng đó sớm muộn gì cũng sẽ cắt nhau.

### 💡 Các bước thuật toán
Để tránh mọi sai số, ta biểu diễn độ dốc dưới dạng một cặp số nguyên $dx$ và $dy$ (đã rút gọn).
1. Xét cặp điểm $A(X_i, Y_i)$ và $B(X_j, Y_j)$. Ta tính:
   - $dx = X_j - X_i$ (là bước đi theo chiều ngang (trục hoành). Nó cho biết từ $A$ đến $B$, ta phải tiến hay lùi bao nhiêu bước theo phương ngang.)
   - $dy = Y_j - Y_i$ (Là bước đi theo chiều dọc (trục tung). Nó cho biết từ $A$ đến $B$, ta phải lên cao hay xuống thấp bao nhiêu bước.)
2. Tỷ số dy/dx có ý nghĩa gì?Trong toán học, tỷ số $m = \frac{dy}{dx}$ được gọi là Độ dốc hay Hệ số góc (Slope) của đường thẳng.Nó mang ý nghĩa thực tế là: Cứ tiến tới 1 đơn vị theo chiều ngang ($X$), đường thẳng sẽ nhích lên (hoặc chúi xuống) bao nhiêu đơn vị theo chiều dọc ($Y$)?Ví dụ 1: Nếu $\frac{dy}{dx} = \frac{2}{1} = 2$. Nghĩa là cứ đi ngang 1 bước, đường thẳng vút lên cao 2 bước. Đây là một con dốc rất đứng.Ví dụ 2: Nếu $\frac{dy}{dx} = \frac{-1}{3}$. Nghĩa là cứ đi ngang 3 bước, đường thẳng mới chúi xuống 1 bước. Đây là một con dốc lài lài đi xuống.
2. Rút gọn phân số bằng cách chia cả $dx$ và $dy$ cho Ước chung lớn nhất (GCD) của chúng: `g = GCD(|dx|, |dy|)`.
3. **Chuẩn hóa dấu:** Để Vector hướng lên hay hướng xuống của cùng một đường thẳng được tính là một, ta quy ước: Nếu $dx < 0$ thì đổi dấu cả $dx$ và $dy$. Nếu $dx = 0$ (đường thẳng đứng), ta luôn ép $dy = 1$.
4. Lưu chuỗi `"dy/dx"` vào một cấu trúc dữ liệu **Set** (Tập hợp). Thuộc tính của Set sẽ tự động loại bỏ các độ dốc bị trùng (tức là song song).
5. Kết quả bài toán chính là kích thước của Set.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">GCD</span>(<span class="var">a</span>, <span class="var">b</span>):
    <span class="kw">NẾU</span> (<span class="var">b</span> == <span class="val">0</span>) <span class="kw">TRẢ VỀ</span> <span class="var">a</span>
    <span class="kw">TRẢ VỀ</span> <span class="fn">GCD</span>(<span class="var">b</span>, <span class="var">a</span> % <span class="var">b</span>)

<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NHẬP</span> <span class="var">X[i]</span>, <span class="var">Y[i]</span>

<span class="var">TapHop_DoDoc</span> = <span class="fn">Khoi_Tao_Set_Rong</span>()

<span class="com">// Duyệt qua mọi cặp điểm (i, j)</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="val">1</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="var">i</span> + <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="var">dx</span> = <span class="var">X[j]</span> - <span class="var">X[i]</span>
        <span class="var">dy</span> = <span class="var">Y[j]</span> - <span class="var">Y[i]</span>
        
        <span class="com">// Chuẩn hóa đường thẳng đứng và ngang</span>
        <span class="kw">NẾU</span> (<span class="var">dx</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">dy</span> = <span class="val">1</span>
        <span class="kw">NGƯỢC LẠI NẾU</span> (<span class="var">dy</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">dx</span> = <span class="val">1</span>
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">g</span> = <span class="fn">GCD</span>(<span class="fn">ABS</span>(<span class="var">dx</span>), <span class="fn">ABS</span>(<span class="var">dy</span>))
            <span class="var">dx</span> = <span class="var">dx</span> / <span class="var">g</span>
            <span class="var">dy</span> = <span class="var">dy</span> / <span class="var">g</span>
            
            <span class="com">// Chuẩn hóa dấu (luôn giữ mẫu số dx dương)</span>
            <span class="kw">NẾU</span> (<span class="var">dx</span> < <span class="val">0</span>) <span class="kw">THÌ</span>:
                <span class="var">dx</span> = -<span class="var">dx</span>
                <span class="var">dy</span> = -<span class="var">dy</span>
                
        <span class="var">chuoi_do_doc</span> = <span class="fn">TO_STRING</span>(<span class="var">dy</span>) + <span class="str">"/"</span> + <span class="fn">TO_STRING</span>(<span class="var">dx</span>)
        <span class="var">TapHop_DoDoc</span>.Them(<span class="var">chuoi_do_doc</span>)

<span class="kw">XUẤT</span> <span class="var">TapHop_DoDoc</span>.Kich_Thuoc()
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Toán học + Cấu trúc Set ($O(N^2 \log(\max))$)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N^2)$ số cặp điểm. Mỗi cặp dùng hàm GCD mất $O(\log(\max(\text{tọa độ})))$. Với $N \le 200$, máy tính chỉ chạy khoảng $20000$ phép tính $\rightarrow$ Đạt 100% điểm tuyệt đối.</td>
                </tr>
                <tr>
                    <td class="td-label">Cấu trúc dữ liệu</td>
                    <td><code class="inline-code">std::set&lt;pair&lt;int, int&gt;&gt;</code> trong C++ hoặc <code class="inline-code">Set&lt;string&gt;</code> để đếm số phần tử duy nhất rất tiện lợi.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>