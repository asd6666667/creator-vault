import init, {
  cache_keystore,
  clear_cached_keystore,
  create_keystore,
  derive_accounts,
  export_mnemonic,
  sign_message,
} from "@consenlabs/tcx-wasm";

let ready = false;

const ETH_PATH = "m/44'/60'/0'/0/0";
const WASM_URL = "/tcx-wasm/tcx_wasm_bg.wasm";

export async function initTcxWasm(): Promise<void> {
  if (ready) return;
  await init(WASM_URL);
  ready = true;
}

export function isTcxReady(): boolean {
  return ready;
}

export {
  cache_keystore,
  clear_cached_keystore,
  create_keystore,
  derive_accounts,
  export_mnemonic,
  sign_message,
  ETH_PATH,
};
