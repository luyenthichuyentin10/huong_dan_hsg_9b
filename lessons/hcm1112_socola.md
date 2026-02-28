## Bài 3: Sô-cô-la

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Mạnh cần ăn chính xác $K$ ô vuông sô-cô-la. Các thanh sô-cô-la trên thị trường luôn có kích thước là lũy thừa của 2 ($1, 2, 4, 8, 16, ...$). Mạnh chỉ có thể bẻ đôi một thanh sô-cô-la có kích thước $D$ thành hai thanh $D/2$.

**Yêu cầu:**
1. Tìm chiều dài thanh sô-cô-la nhỏ nhất ($L$) mà Mạnh cần mua để có ít nhất $K$ ô. ($L$ phải là lũy thừa của 2 và $L \ge K$).
2. Tìm số lần bẻ ít nhất để có tổng các thanh nhỏ bằng chính xác $K$.

**Ví dụ:** $K = 6$
- Thanh nhỏ nhất có thể mua là $8$ (vì $4 < 6 \le 8$).
- Bẻ 8 thành 4 và 4. (Lần 1)
- Lấy một thanh 4. Cần thêm 2 ô nữa.
- Bẻ thanh 4 còn lại thành 2 và 2. (Lần 2)
- Lấy thêm thanh 2. Tổng cộng $4 + 2 = 6$.
$\rightarrow$ Kết quả: `8 2`

</div>

### 💡 Hai hướng tiếp cận thuật toán

<br>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 1: 🎬 Thuật toán mô phỏng</div>

**Ý tưởng xử lý**
1. **Tìm chiều dài $L$:** Bắt đầu từ $L=1$, liên tục nhân đôi $L$ cho đến khi $L \ge K$.
2. **Tìm số lần bẻ:** 
    - Nếu $L = K$, số lần bẻ là $0$.
    - Nếu $L > K$, ta thực hiện bẻ đôi thanh hiện tại. Nếu phần vừa bẻ ra nhỏ hơn hoặc bằng số ô còn thiếu, ta "lấy" phần đó và giảm số ô cần tìm. Quá trình dừng lại khi số ô còn thiếu bằng 0.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="var">L</span> = <span class="val">1</span>;
<span class="kw">TRONG KHI</span> (<span class="var">L</span> < <span class="var">K</span>): <span class="var">L</span> = <span class="var">L</span> * <span class="val">2</span>;

<span class="var">S</span> = <span class="var">L</span>; <span class="var">so_lan_be</span> = <span class="val">0</span>; <span class="var">con_thieu</span> = <span class="var">K</span>;
<span class="kw">NẾU</span> (<span class="var">L</span> > <span class="var">K</span>) <span class="kw">THÌ</span>:
    <span class="kw">TRONG KHI</span> (<span class="var">con_thieu</span> > <span class="val">0</span>):
        <span class="kw">NẾU</span> (<span class="var">con_thieu</span> >= <span class="var">S</span>) <span class="kw">THÌ</span>:
            <span class="var">con_thieu</span> = <span class="var">con_thieu</span> - <span class="var">S</span>;
        <span class="kw">NẾU</span> (<span class="var">con_thieu</span> > <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">S</span> = <span class="var">S</span> / <span class="val">2</span>;
            <span class="var">so_lan_be</span> = <span class="var">so_lan_be</span> + <span class="val">1</span>;

<span class="kw">XUẤT</span> <span class="var">L</span>, <span class="var">so_lan_be</span>;
</pre>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 2: 💎 Toán học và tư tưởng tham lam</div>

#### Cách 2: Phép toán và Tham lam (Tư duy chuyên sâu)
#### 💰 Tư tưởng tham lam
* **Mua thanh nhỏ nhất:** Ta chọn thanh sô-cô-la có kích thước $L$ là lũy thừa của 2 nhỏ nhất sao cho $L \ge K$.
* **Ý nghĩa phần dư:** Câu nói *"phần còn lại thuộc về Xuân"* ngầm hiểu rằng chúng ta chỉ cần tập trung lấy đủ $K$ ô cho Mạnh, Xuân có thể nhận 0 ô nếu $L = K$.

#### 🔍 Quy luật bẻ thanh
Dựa trên giá trị của $K$, ta có các quy tắc xác định số lần bẻ:
1.  **Trường hợp $L = K$:** Không cần bẻ (số lần bẻ = 0).
2.  **Trường hợp $K$ lẻ:** Số lần bẻ bằng đúng số lần mũ 2 để tạo ra $L$.
3.  **Trường hợp $K$ chẵn:** Tiến hành bẻ đôi liên tục cho đến khi tổng các phần được chọn vừa đủ $K$.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="var">L</span> = <span class="val">1</span>; <span class="var">mu</span> = <span class="val">0</span>;
<span class="kw">TRONG KHI</span> (<span class="var">L</span> < <span class="var">K</span>): 
    <span class="var">L</span> = <span class="var">L</span> * <span class="val">2</span>;
    <span class="var">mu</span> = <span class="var">mu</span> + <span class="val">1</span>;

<span class="kw">NẾU</span> (<span class="var">L</span> == <span class="var">K</span>) <span class="kw">THÌ</span> 
    <span class="kw">XUẤT</span> <span class="var">L</span>, <span class="val">0</span>;
<span class="kw">NGƯỢC LẠI</span>:
    <span class="var">tempK</span> = <span class="var">K</span>; <span class="var">so_lan_be</span> = <span class="val">0</span>; <span class="var">S</span> = <span class="var">L</span>;
    <span class="kw">TRONG KHI</span> (<span class="var">tempK</span> > <span class="val">0</span>):
        <span class="var">S</span> = <span class="var">S</span> / <span class="val">2</span>;
        <span class="var">so_lan_be</span> = <span class="var">so_lan_be</span> + <span class="val">1</span>;
        <span class="kw">NẾU</span> (<span class="var">tempK</span> >= <span class="var">S</span>) <span class="kw">THÌ</span> 
            <span class="var">tempK</span> = <span class="var">tempK</span> - <span class="var">S</span>;
    <span class="kw">XUẤT</span> <span class="var">L</span>, <span class="var">so_lan_be</span>;
</pre>

<div class="important-note">

**1. Bản chất toán học và hệ nhị phân**

Trong bài toán này, kích thước thanh sô-cô-la mua về là $L = 2^n$ sao cho $L \ge K$. Khi ta bẻ đôi một thanh kích thước $2^n$, ta thu được hai thanh kích thước $2^{n-1}$. Quá trình này lặp lại giống như việc dịch chuyển các bit trong hệ nhị phân.
- Số lẻ trong hệ nhị phân: Một số $K$ là số lẻ khi và chỉ khi bit cuối cùng (bit ở vị trí $2^0$) của nó bằng 1.
- Ví dụ: $K = 7$ thì $K = 111_2$. Bit $1$ ở cuối tương ứng với giá trị $1$.

**2. Tại sao $K$ lẻ thì số lần bẻ bằng số lần mũ?**
Để có được tổng bằng một số lẻ $K$, bạn bắt buộc phải có ít nhất một thanh sô-cô-la kích thước là 1 (vì tất cả các lũy thừa khác của 2 như $2, 4, 8...$ đều là số chẵn, tổng của chúng không bao giờ ra số lẻ).

Để tạo ra được thanh có kích thước 1 từ thanh ban đầu có kích thước $L = 2^n$, bạn phải thực hiện bẻ đôi liên tục $n$ lần:
- Lần 1: $2^n \rightarrow 2^{n-1}$
- Lần 2: $2^{n-1} \rightarrow 2^{n-2}$
- ...
- Lần $n$: $2^1 \rightarrow 2^0$ (tức là thanh có kích thước 1).

Vì vậy, nếu $K$ lẻ, bạn không thể dừng quá trình bẻ sớm hơn $n$ lần được.

**3. Ví dụ minh họa chi tiết**
Giả sử Mạnh cần $K = 5$ ô sô-cô-la ($K$ là số lẻ).
- Bước 1: Tìm L. Lũy thừa của 2 nhỏ nhất $\ge 5$ là $L = 8 = 2^3$. Ở đây số mũ $n = 3$.
- Bước 2: Quá trình bẻ.
    1. Bẻ lần 1: Thanh $8$ thành hai thanh $4$. Mạnh lấy một thanh $4$. Còn thiếu $5 - 4 = 1$ ô.
    2. Bẻ lần 2: Thanh $4$ còn lại thành hai thanh $2$.Thanh $2$ lớn hơn số ô còn thiếu ($1$), nên không lấy, phải bẻ tiếp.
    3. Bẻ lần 3: Thanh $2$ thành hai thanh $1$.Mạnh lấy một thanh $1$. Còn thiếu $1 - 1 = 0$ ô.
- Kết quả: Số lần bẻ là 3, đúng bằng số mũ của $L = 2^3$.

**4. Áp dụng kiến thức xử lý bit (Bitwise)** 

Trong lập trình, số lần bẻ ít nhất để có đúng $K$ ô từ thanh $2^n$ có thể tính nhanh bằng công thức liên quan đến bit 1 cuối cùng:
<div class="math-formula"> $\text{Số lần bẻ} = n - (\text{vị trí của bit 1 thấp nhất của } K)$ </div>

- Nếu $K = 5$ ($101_2$): Bit 1 thấp nhất ở vị trí $0$. Số lần bẻ $= 3 - 0 = 3$.
- Nếu $K = 6$ ($110_2$): Bit 1 thấp nhất ở vị trí $1$. Số lần bẻ $= 3 - 1 = 2$.
- Nếu $K = 4$ ($100_2$): Bit 1 thấp nhất ở vị trí $2$. Số lần bẻ $= 2 - 2 = 0$ (với $L=4=2^2$).

**Kết luận:** Với $K$ lẻ, bit 1 thấp nhất luôn ở vị trí $0$, do đó số lần bẻ luôn là $n - 0 = n$ (chính là số lần lũy thừa).
</div>
</div>
