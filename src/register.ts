// Registration service (register.walrus.gg)

import mc from "minecraft-protocol";
import Redis from "./initializers/redis";

export default function registerService() {
  const server = mc.createServer({
    host: "127.0.0.1",
    port: 25565,
    motd:
      "\u00a73\u00a7lWalrus \u00a7r- \u00a7bRegistration server\u00a7r\n\u00a78walrus.gg/register",
  });

  server.favicon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH5AIHBxARgyu8ywAAFTpJREFUeNrtmnmUHFd97z/33qrep3v2fTTaF0s2khfJFpaMQDIYGxxMYngJeTk58QvBIYGEBEhO4gMJJyQ8kkceSSDg4EDYsR0CDn4xwrbMM0/YSI53ycaybG3WrtHM9HR33SV/VFVXdc8YS7bx26hz6lTPVNW99/f9/b6/7Rb87PjZ8bPjZ8f/x4d4heeT0Qng5liDjc7/5w4VnXMeQrToQQIer5ByftqTKIRwOGcBMtn8cKM+sxlYD4wQavs0sA940PMzP9BBYx+AkFI4ayVg/m8EQAghpXPWOOeQSm121l4PXJ7NFYvlzn5XKFWEUj7Wamaqk0yeOkp1eqIG3CuEuHFwdMmtjdpM48SxA8o5a0ko8382AEJI4ZxVgPb87Bod1D+hPH/j6PxVbtGKtaJ/aIEpFCpOKhXP7awx1OtVceLoPrVn9w6398mdol6bflwp733G6NsBJaVy1pqX3T+8rAAo5QljtACsEPIPnLN/Or54tVp98VWmp2/UOWuVMYFoKtO5GDWkVCjPc1L5dmriGA/df4d8/MFtwlpz4/C85b/1gb/4Tu13fmmJfLlBeNkAUJ4vjA5Yft5l/q6Htn0hky287eJNb9eLVqwVJqgrYwKEkHjKQyqFFKJldmsd1lqcs0ipyGQL5uC+3W7b7Td5p08dua/c2Xd1bWb6OR3UlLX2ZfMLLwsAnp8ROmiw6oIt/iM7vvvNjkrfFZuuemdQ6RrwgsaM8DwPpTyUkkipkFIiZRgNhRA453CRNVhrMMYQBAF+JkfQqAVbv/Vp/9C+3bvKnX2vq1WnDmrdeNks4SUDkM2XqM9MSUKP/rVyZ/+1m3/ut4JcruQHwQy+n8HzPHzfj0AIAQgjnwAczpECwGKMQWuNMQFK+Qip9B3//Dfe/r2P7hwaW7qpVp06PTlxTGjdeMmOUb3UAYxuqEj4D+cL5es3X/3uoFAo+41GjUwmQ6HQQaHYgZQCpVQERGIF6d8xAACe5yOEQOsGQgi5aPna4MAzj40ePvjUktrM5DesNTKbLzqjg/99AAghFTgjhNgihLhx4xXX2Z7+Ma9eq5IvlPD9DEcOPsVz+5+g3NlLNlcAiCxANK+tYwqEEExOHEdKRaFYQesGSnlqbMEq/ePHf7hKB42TwHZrtOIlhscXDYCQUiCwo+Mri6dPHbll5flb+padu8HNVCdFNpenUZtm67c+xQPb/5Wnn9hJd98wo/OXo4N6ZP7husMcyYEDYw2ZbIFHdt7Ft776cfbs/hFBY4bBkcVoXadU7hHFUqd4+okdl2ay+VuMDo5JKaWL+fOKAgDKOedOnzrywc7uoWvXb36HDho1JaWgWCrzzJMP8NiDdwOwcOn5XLD+SoQIaZDLF8nli2SyOXw/h5QKrQOs0SAEQVBnzxM7qE5NcOCZXXT3DjMwvIjq9IQYHF1sjh15Nnf8yL4B4GbnnADxogF4UU5QCCGccy6bKw7Xa9MPbnj9r/aOL17j6rVpkclk8P0MzhqeO/AkmWyeeQtXIoXAz2SxJuCp3TvZv/dxqtOnyRc6GJ2/ggVLVqO8DNXpSTLZPCePH+LRnXfTaNQ476ItlCt91OszeF6G06eOuFv/6SPC6GAj8H0hhHRRuv1KAeA55zTw4b7BBTdcfs17dNCoeWlPr5Qik80Djka9SqFY5tC+J/jOzZ9keuoU+UIHxVKF6akJZqqTFEudXPHWdzM0upRq9TSen8XzMoBABzWM1lhnCYKAYqli7vrO59Tuh//nrcBbo7T7FQNAAK6rd6Tj5LEDD7968y+PL1x+kWvUZ0QMgOcpQMQ1EOVKN9OTJ/ncf38vw6OLees73u9G5i0Rnp8lqNfY/+xubvnif3WHDz4tfuXdf0m+WKY6fRoQCEA0I4TDGoNUnjt5/KD4ly99NLDWrAEeJawizxqEF+MDFOBq1cm3dFR6r7twwzXGGiPDMBcmO7Fnz+YKZDJZDj77ON/715sIGjXe/ydfYWB4vtA6wFoNCPoH57F67Ra2fffLzFRPi3nzzyFfKGOdiSxOEjpNgRAQBA1R7uzXhw886Z8+dfQ4cJcQIg7HZ3XIs30hFbauHZ2/imy+1Exfw1ge3i8UK5w6doBbPv8RbvnCn3H00B6MCThy+Bky2Ty5XKF5zeYKHD38jLDWikcf2MZn/urdbL/7G3hKkcsVwFmEiIENQXAOuWDpBQBvABhfvFq/CGWetQUIwHp+tmKt+diaS64qFUqdAmdEzHspJcVShUcf+B7f/tp/w5o6v/CLv8517/p9Hn34R3znmzcR1KtI5dladUocOfws92z9Gl/6zIdZuGgJ17/3Bk6fOs6O7Vt5atePmLdwJZ3dAzQaNZQKl2utwzlDsdQl9uy6fyAI6jefOvHcsUihZxURztYHKMIGxfqOSt+9b7z295yUUsQZnVKKUkcn93//n9m+7VbOW72O6971fgYGh3DWMDk5wedv/AT33rMVBy6KJgjg0su28J9/7T10dfVirOW+7ffw2b/9c6ozVd7ySx9gbMFKpicncIDWGmsN2VxJb/3Wp7yndt3/XuCvEcIjdM4/LQto8uzasYXnXr5o+TpjdEMq5RHG/woP3vdv/ODOr7Npy5t5z/s+RDaXo16bwVpDPl/g0o2Xc8WbruXQwX1i/769XHn12/nDD/0Vl226AqUUtVqVIKizaNFy1q5/DQ89sJ3t99zGwiWvotI1QBDUkVLhrEN5ntM6kHuf3NkAvprNFYXRwVlZwFn5AD+TjQffMDi6FOesCHnpyOeLHNq3m+9/90us37CFd/7mBwiCOkYHhNWgIggCqtVphICn9zwBwMH9e6l0djE5OYHWOooiPlNTE/T3D3LDRz7JwMAg3/zKX1KvTZHJZCNdCHRQl8NjSykUK+uAznpt2pytVZ8NACJo1AxQ8DO587v7xtC6IcLcXWKs4a7bv8DA4DC/9hu/R6NeAxxKqabjtNbQUa7w1S9+liOHD7Hqgst5YMd2tt15O5XOboxJynzP86nVqnR19fC7f/BnTE+e5Ptbv9rMLaQUWGtEqdxte/rHBoDVL0apZwVAdF3Z2T041lHudUYH0lpLJpvn2ace4uSx/bztHe+iUChitEbKkGHOOXQQUOns4e7v3c7tt32DledvYe1lb6dnYD6f/buPsX/fMxQKRbROKKyUx9TUJEuXreKaa3+FR3bexYmj+8lmC1GGAEr5tn9oAcDrQsMQPzULiJ9d19kzjPJ8EydfUkqefOw+urt7WXXuhVSrU6nkJezydHb1cO89W/nrj/8xg6PLeNW6K8FpNlz+q9Qbmo9++Hc5fvwoxWIHOgia/QGlFNXpKV675c0I4MnH7iOTzSJEOK+1Wg6NLgW4HOB1V/2Xs+oWnTEASnkx/9d39Y6GXZwQcaw1HD+6n/EFS8jlC+ggwFqDtZZCISx8bv7aTXz8ox+kZ2ABG99wHb7vk88pevtHee2brue5Qwf54w+8k927HqbS1YOUEmPCMeq1GXp6+hhfsIgDzz5JpGmEkOigIfoGxyl39q0Glm799mfc2ch1pg8KY7QBPOX5F/T0j6F1Q8bWJoQgX+jgyOGDWOfo6u6lo9xJNpvjkYd3cMMH38UX//FvGV+8hs1X/zbZXIF8zgPAU5aR8RW8/uffR7Va54YP/gb/9LlPUq/XKJc7KRZLlMoVlPKZmamiPC/sIEHTDxRKnaZ/aGEGeG20oDNX7FkA5YCl5c7+P1qx+rXSWYsQQkgh8P0snufz0I67ePyRHRw9cogf/uBuPv+5v+G2b36FiYkJLtr4C5y//hqUEuRzPlIqrA2dmZKOXKGL8aUXMXHyMD+89w7u+B//wsEDzzI1Ncnh5w5wy9dv4vFHH+SSy66hp28UrRuAwFqL72dcvTYl9/743wXwZT+Twxp9RuHQOwsALHBhubNfZbIFU69NKecEQkpqtWkWrVhLrVblh/fcyu5dDwOw8pwV+GLQFfvOE+dd9Ebq1ZMUCvmQNs4ihcA5kFKRyxhyfYOsWLOZmYl9LF+2jLu23sad3/12s3G65uIrWXLOOmq16WZ9IIUkaNTl8LzlZHOFS+u16nDQqB0kbji+HBYgwtkscP38xWsuHBxbZoNGXYYhLszRBTC+cCWr176B/uFlHNn/KF/+/D+wZ88ecfhkQ686b62U0kVrck0vHrfAAPK5LKdOPMeJ53bxhZtudNu3b7flgXPlJZvexvmXXMWqNRsIGnVaG0AOY7QodnSZ/Xsfy58+dfQB4OFIthcE4Iy4sunKd8ax6aKu3hGs0bK9qyulpD4zRS6Xoa9/ACkFvd0lnNPk8wWRyfiRU3NRLt+62+Wcw1iL52fQ2tBRyuJ7UgwMjbNq9SX09g1Qn5mOokryfgyelIqR8RUAV8Z/n6lpv6AB3HnbpwGGM9n80nLXIEYHUQIUbu7E2aBDoLWm0agjhMDzPHRYv6t44XGUds61bIbEWg2jisVaJ5RS0pgGjXqVRqOOIxQ8uh8BEb6jg4YYHluGEGIDULLWnFFWeCYAxM+8qqPSVyp2dFlrdMu2joi4HC8ozg8agSEINFJIrG23RkEMYvwbCJ91jiAwIJKxIL175FpoELXPZaV7yHVUekeBNWcq3xkA0MysLu4dnI/vZ204uZgDYAfR4gQCax1aG6SK6OiS7cDm8+kxwp3k5ntCyATUyOznbgALrNHk8iUzMLIYYF0EzEu3gEKxHKvg4v6hRRhjBCKBJe3EEjlcqD3nCAKN5/nxOhGt8tLuB5TysNamLMc2QU1kd833m5QCrDVidHwlwGaAfLFiX0jGFwJAVKcnLFDOFTrO7e4dxeiGjDp1CPH8AEghEFKgjUZ53ixzT14RLdemBRiT7BtGY87Wp2uCKIQgaMzIgZHFFEtdrwZGq1OnLHOb6hkDEN8/p6PSN1QodTpjdHr1swEQInSHQuApgTUGJeN0I72OGMDWcaSUkTZtBEBk9q7dcbbuKYLAaC2KHd2mf3hhKbaCZr3+4gBoSrahq3cE5WcMTW9NkgO0yB9u/wsBSoUOTaR2gtNgOZdEkSiuhmA5EguIhcU1nV9CnYQKYRQKryPj5wC8GcDzsz8xF/iJAGRzhZj/l/UNLsBZE+cvcwje1GtyHzDGoDyvyeNYe7OUEm2XCSkj3xEgZAjgrEeboZRZ4zTqM3JwZAm5QsdGoC/qYbwoCoh6bdoClWyueEF33xg6SAqg1KqbixFCEJYhrgmA1galPIxtjfUxBUhp1tiwu2xd2PeTUaUZaz8dSptad63za90QhY5u0ze4oAd4TTTh88r5kwCI762udA8OlsrdIf9bUliajjBcRBjWQoclsC60ABmFs7T2ku8CUgI5EDJ83xoTbpuL9GeFri0HSOjdHDe6NTS6DOBqAPUTssLnByBR9cae/nl4XsL/dseaDkc4h+dlUJ6HNRpjLEIqkrRVtE0R5w3RgiKBjbVIpfCzOZr1b3NPwM1NI8JdpCCoy8HRpWSy+U1AJSrl56TB8wJQLHXF/N/YOzCfdu8fazxZjGgmLn4mSzaTQ5vwcxcpZWqtrhkOW6wiAkMpD4QiaDTwfZ9cvgPrbBPhdC7Qml2K5ml0IMpd/banf3wY2BBNMqeszweAmJ48YYHeXKHj/O6+sTD+Nx1g2vRjM3TN7lC+0IHwskxXp3FCks0Vml9+tL4TA5EAqjyfbDZPvV7jxMlJevqGMVq3UC4WNPYLs+kFUio7NLYM4E1pyzpTAOL/n9/ZPdRd7OiyxpjWz7pSCU06SzNG01HuxMoS9933IzpK5dAyiHMSZmV1zrko3FmMNeTzeb5x89fdZM1jaGQ+QVCHWfmMa/E97QWVDupycGwZnpfZAuSfrziaE4BUDn1Zz8A4Unm2LYmfdaRjtA4arNv4Fj72ic+yZ8+PyWQyc3wamGSAYeoQvquUR71e445tO8Xa11yLNTqVP7RqOu1QE9mirDBoyErXoO3uH1sAXBK9MEveOd1j/9AiNz11EuBDK9e8brxU7nHGaJnU3hIpRYtTi/+OOrV0dfdTrAwRaMvyVZeEPIaUGbcnRpFPcI7uvhEu3vgWstkCQdBorjvWcvi3oL0x4hxRqWxx1uJn82Z68oQ8fODHJ4F/i75psi8EgJieOumAoUKp8yOrLnh9VrS573TamnAz+a2UR6NRp6tnkKUr12KMbuFpM2cQbY4wokN3z3CYFxjdFDQR1pHOAmMfEPqfhAqxTXh+Rjy9+/6Kc+7vwel2GsxFgfh/F3b2DJcLpYqxVrdxR7TxOFl8/J2fEIJGYyb60MG1hLwEiESodKeoXq82nWZrqEtS3xgU2/Id9eweQXfvqOvuG10BXBTdaZF5FgAp/r+md2AcIZWbu5RoFSjtA+J+fuKtST2XCJwI0T5Oe4hNTLx1riQ5Csdo7Tc4Z/EzWTMwsgSiVpkQL2ABF2/6T/HOyqW9A/MxOpgV/9M8bm9YxBsiaa/c5GVL+uqa76RNu1X4WNu2RePxO8n47ZYQr1Oig4YcnrcC4I19ff24tu3zdgDk/7rzyw4YL5V7zu3qGY7i/+z8P+0W4ttpM46toFWztilgqwXYFEi2RbOtZW9r7t+q7dnZYRwNevrn0dU7subo0SOr22nQDkAs6dqu3pF8rlA21poW9acbGSKVnSUgzSVUYgkQA2FTDc50t7hV44llOVrjfVrY9tI4FV2cJZsr6IHhxQBvjGSYGwAhZCv/hXge/s8GJG3eaa6mNRtbSbqya+X1bNqETjUBK+1L0md6DekCDSHQOhDD85ZD5AcWLl/X3EBtAcA5qy+74joQ4tVh/h/Idv4nkyc1QCJAYgHJ74T/CSCujQaxFqP9ARMKnfYnsYWkVtFytvqX1k0XHdRlz8B8yp39FwHLn3p8u4tpkAZAAmy7/cYl5UrfOZXuIXTU/58NQNp0TYupJr27Vv4mz6U5HgtnIoFb/UDaT6QjTqsFtIbA9l5jVJ+IXL6k+4cX+cDr0zSYBQCwrqt3xM/lS8a18T8xexE5utDZGZMGIR3T0xy2KSHbBXZNzScWkua6SAFLm8W0W2TaQhIwrLViaGw5RMVRsaPHQmpzVEgZb0Js6h2c3z5CC/LpScJXbLNKC5uZ8da1RIgEjKQMtqnxWmmU3nJLCqBWzSfPtI6T9gFxdhhfdVCT/cMLKXZ0r5+ePDF/6vSxvYCMtS5c9NmmEGJtT/88jA7k3NXfXL3AuTTu2nKC2Fp0dG21iJAi6X2/pORO1wxJDpKAmlSkrflBes3WGFEodpq+wfl54u8IQP4HOjuV+7fHLHkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDItMDdUMDc6MTY6MTctMDg6MDAu0sRLAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAyLTA3VDA3OjE2OjE3LTA4OjAwX4989wAAAABJRU5ErkJggg==";

  server.on("login", function(user) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    Redis.hmset(token, "uuid", user.uuid, "username", user.username, "EX", 300);
    user.end(
      `§eYour auth token is §6§l${token}\n§eThis token will expire in §l5 minutes\n\n§8walrus.gg/register`
    );
  });
}
