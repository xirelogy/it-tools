<script setup lang="ts">
import { config } from '@/config';
const openccConfig = config.opencc;

const simplifiedText = ref('');
const traditionalText = ref('');
const optionIndex = ref(0);
const errorModalContent = ref('');

const refErrorModal = ref();

const options = [
  {
    name: 'OpenCC standard',
    sopt: 's2t.json',
    topt: 't2s.json',
  },
  {
    name: 'Taiwan variant',
    sopt: 's2tw.json',
    topt: 'tw2s.json',
  },
  {
    name: 'Taiwan variant + idiom',
    sopt: 's2twp.json',
    topt: 'tw2sp.json',
  },
  {
    name: 'Hong Kong variant',
    sopt: 's2hk.json',
    topt: 'hk2s.json',
  },
];

async function callOpenApi(text: string, config: string): Promise<string> {
  const response = await fetch(`${openccConfig.apiUrl}/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      config: config,
      text: text
    })
  });

  if (response.status !== 200) {
    let err = null;
    try {
      err = await response.json();
    } catch (e) {
      throw new Error('API failed');
    }

    throw new Error(err.message ?? 'API failed');
  }

  const reply = await response.json();
  return reply.result;
}

let isRunning = false;

async function onSimplifiedInputUpdate(value: string) {
  if (isRunning) return;
  try {
    isRunning = true;

    const option = options[optionIndex.value] ?? null;
    if (option === null) return;

    if (simplifiedText.value.length <= 0) return;

    try {
      const result = await callOpenApi(value, option.sopt);
      traditionalText.value = result;
    } catch (e) {
      errorModalContent.value = (e as Error).message;
      refErrorModal.value?.open();
    }
  } finally {
    isRunning = false;
  }
}

async function onTraditionalInputUpdate(value: string) {
  if (isRunning) return;
  try {
    isRunning = true;

    const option = options[optionIndex.value] ?? null;
    if (option === null) return;

    if (simplifiedText.value.length <= 0) return;

    try {
      const result = await callOpenApi(value, option.topt);
      simplifiedText.value = result;
    } catch (e) {
      errorModalContent.value = (e as Error).message;
      refErrorModal.value?.open();
    }
  } finally {
    isRunning = false;
  }  
}

</script>

<template>
  <div>
    <div>
      <c-select
        v-model:value="optionIndex"
        :options="options.map(({ name }, i) => ({ label: name, value: i }))"
        data-test-id="option-select"
      />
    </div>

    <c-input-text 
      v-model:value="simplifiedText"
      multiline
      placeholder="e.g. '简体中文'"
      label="Enter simplified chinese text"
      autosize autofocus raw-text
      @update:value="onSimplifiedInputUpdate"
      test-id="simplified-input"
    />
    <c-input-text
      v-model:value="traditionalText"
      multiline
      placeholder="e.g. '繁體中文'"
      label="Enter traditional chinese text"
      autosize raw-text
      @update:value="onTraditionalInputUpdate"
      test-id="traditional-input"
    />
  </div>

  <c-modal ref="refErrorModal">
    <c-alert type="error">{{ errorModalContent }}</c-alert>
  </c-modal>
</template>

<style lang="less" scoped>
</style>