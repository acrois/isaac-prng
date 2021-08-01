import { uncomplementBigInt } from "./functions.js";

// TODO uncomplementBigInt requires us to define a boundary
//   further testing is required for anything other than what
//   falls within an integer (4 bytes)
export default class Isaac {
    private static readonly GOLDEN_RATIO = 0x9e3779b9n;
    private static readonly SIZEL = 8n; // log of the size of the result and memory arrays
    private static readonly SIZE = 1n << Isaac.SIZEL; // size of result and memory arrays
    private static readonly MASK = Isaac.SIZE - 1n << 2n; // psuedorandom lookup mask

    private count: number = 0; // position in rsl[]
    private rsl: bigint[] = []; // the results given to the user
    private mem: bigint[] = []; // the internal state
    private a: bigint = 0n; // accumulator
    private b: bigint = 0n; // the last result
    private c: bigint = 0n; // counter, guarantees cycle is at least 2^^40

    constructor(seed?: number[]) {
        this.rsl.fill(0n);
        this.mem.fill(0n);
        this.init(seed);
    }

	// generates 256 results
	private isaac() {
		let x = 0n, y = 0n;
		let i = 0, j = 0;
		this.b += ++this.c;

		for (i = 0, j = Number(Isaac.SIZE / 2n); i < Isaac.SIZE / 2n;) {
			x = this.mem[i];
			this.a ^= this.a << 13n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;

			x = this.mem[i];
			this.a ^= uncomplementBigInt(this.a & 0xFFFFFFFFn, 32) >> 6n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;

			x = this.mem[i];
			this.a ^= this.a << 2n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;

			x = this.mem[i];
			this.a ^= uncomplementBigInt(this.a & 0xFFFFFFFFn, 32) >> 16n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;
		}

		for (j = 0; j < Isaac.SIZE / 2n;) {
			x = this.mem[i];
			this.a ^= this.a << 13n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;

			x = this.mem[i];
			this.a ^= uncomplementBigInt(this.a & 0xFFFFFFFFn, 32) >> 6n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;

			x = this.mem[i];
			this.a ^= this.a << 2n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;

			x = this.mem[i];
			this.a ^= uncomplementBigInt(this.a & 0xFFFFFFFFn, 32) >> 16n;
			this.a += this.mem[j++];
			this.mem[i] = y = this.mem[Number((x & Isaac.MASK) >> 2n)] + this.a + this.b;
			this.rsl[i++] = this.b = this.mem[Number((y >> Isaac.SIZEL & Isaac.MASK) >> 2n)] + x;
		}
	}

    private init(seed?: number[]) {
        let a = Isaac.GOLDEN_RATIO, b = a, c = a, d = a, e = a, f = a, g = a, h = a;

        for (let i = 0; i < 4; i++) {
			a ^= b << 11n;
			d += a;
			b += c;
			b ^= uncomplementBigInt(c & 0xFFFFFFFFn, 32) >> 2n;
			e += b;
			c += d;

			c ^= d << 8n;
			f += c;
			d += e;
			d ^= uncomplementBigInt(e & 0xFFFFFFFFn, 32) >> 16n;
			g += d;
			e += f;

			e ^= f << 10n;
			h += e;
			f += g;
			f ^= uncomplementBigInt(g & 0xFFFFFFFFn, 32) >> 4n;
			a += f;
			g += h;

			g ^= h << 8n;
			b += g;
			h += a;
			h ^= uncomplementBigInt(a & 0xFFFFFFFFn, 32) >> 9n;
			c += h;
			a += b;
        }
		
		/* fill in mem[] with messy stuff */
        for (let i = 0; i < Isaac.SIZE; i += 8) {
			if (seed) {
				a += this.rsl[i];
				b += this.rsl[i + 1];
				c += this.rsl[i + 2];
				d += this.rsl[i + 3];
				e += this.rsl[i + 4];
				f += this.rsl[i + 5];
				g += this.rsl[i + 6];
				h += this.rsl[i + 7];
			}

			a ^= b << 11n;
			d += a;
			b += c;
			b ^= uncomplementBigInt(c & 0xFFFFFFFFn, 32) >> 2n;
			e += b;
			c += d;

			c ^= d << 8n;
			f += c;
			d += e;
			d ^= uncomplementBigInt(e & 0xFFFFFFFFn, 32) >> 16n;
			g += d;
			e += f;

			e ^= f << 10n;
			h += e;
			f += g;
			f ^= uncomplementBigInt(g & 0xFFFFFFFFn, 32) >> 4n;
			a += f;
			g += h;

			g ^= h << 8n;
			b += g;
			h += a;
			h ^= uncomplementBigInt(a & 0xFFFFFFFFn, 32) >> 9n;
			c += h;
			a += b;

			this.mem[i] = a;
			this.mem[i + 1] = b;
			this.mem[i + 2] = c;
			this.mem[i + 3] = d;
			this.mem[i + 4] = e;
			this.mem[i + 5] = f;
			this.mem[i + 6] = g;
			this.mem[i + 7] = h;
		}

		/* second pass makes all of seed affect all of mem */
		if (seed) {
			for (let i = 0; i < Isaac.SIZE; i += 8) {
				a += this.mem[i];
				b += this.mem[i + 1];
				c += this.mem[i + 2];
				d += this.mem[i + 3];
				e += this.mem[i + 4];
				f += this.mem[i + 5];
				g += this.mem[i + 6];
				h += this.mem[i + 7];

				a ^= b << 11n;
				d += a;
				b += c;

				b ^= uncomplementBigInt(c & 0xFFFFFFFFn, 32) >> 2n;
				e += b;
				c += d;

				c ^= d << 8n;
				f += c;
				d += e;

				d ^= uncomplementBigInt(e & 0xFFFFFFFFn, 32) >> 16n;
				g += d;
				e += f;

				e ^= f << 10n;
				h += e;
				f += g;

				f ^= uncomplementBigInt(g & 0xFFFFFFFFn, 32) >> 4n;
				a += f;
				g += h;

				g ^= h << 8n;
				b += g;
				h += a;

				h ^= uncomplementBigInt(a & 0xFFFFFFFFn, 32) >> 9n;
				c += h;
				a += b;

				this.mem[i] = a;
				this.mem[i + 1] = b;
				this.mem[i + 2] = c;
				this.mem[i + 3] = d;
				this.mem[i + 4] = e;
				this.mem[i + 5] = f;
				this.mem[i + 6] = g;
				this.mem[i + 7] = h;
			}
		}

		this.isaac();
		this.count = Number(Isaac.SIZE);
    }

	public nextInt() {
		if (0 == this.count--) {
			this.isaac();
			this.count = Number(Isaac.SIZE - 1n);
		}

		return BigInt.asIntN(32, this.rsl[this.count]);
	}
}