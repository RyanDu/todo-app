export class TrieNode{
    children = new Map<string, TrieNode>();
    end = false;
    id: number | null = null;
}

export class CategoryTrie{
    root = new TrieNode();
    nameToId = new Map<string, number>();

    insert(name: string, id: number){
        const key = name.toLowerCase();
        let cur = this.root;

        for(var ch of key){
            let next = cur.children.get(ch);
            if (!next) {
                next = new TrieNode();
                cur.children.set(ch, next);
            }
            cur = next;
        }

        cur.end = true;
        cur.id = id;
        this.nameToId.set(key, id);
    }

    getId(name: string){
        return this.nameToId.get(name.toLocaleLowerCase()) ?? null;
    }

    search(prefix: string, limit = 8): {name: string; id: number}[]{
        const key = prefix.toLocaleLowerCase();
        let cur = this.root;
        for(const ch of key){
            var next = cur.children.get(ch);
            if(!next) return [];
            cur = next;
        }

        const out: {name: string, id: number}[] = [];
        const dfs = (node: TrieNode, acc: string) => {
            if(out.length >= limit) return;
            if(node.end && node.id != null) out.push({name: acc, id: node.id});
            for(var [ch, next] of node.children) dfs(next, acc + ch);
        }

        dfs(cur, key);

        return out;
    }

    remove(name: string) {
    const key = name.toLocaleLowerCase();
    const stack: [TrieNode, string][] = [];
    let cur: TrieNode | undefined = this.root;
    for (const ch of key) {
      if (!cur.children.has(ch)) return;
      stack.push([cur, ch]);
      cur = cur.children.get(ch)!;
    }
    cur.end = false; cur.id = null;
    this.nameToId.delete(key);
    // clean useless 
    for (let i = stack.length - 1; i >= 0; i--) {
      const [node, ch] = stack[i];
      const nxt = node.children.get(ch)!;
      if (nxt.end || nxt.children.size) break;
      node.children.delete(ch);
    }
  }
}