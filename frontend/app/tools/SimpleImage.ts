import './simple-image.css';

export interface SimpleImageData {
  url: string;
}

export default class SimpleImage {
  private data: SimpleImageData;

  static get toolbox() {
    return {
      title: "Image",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  constructor({ data }: { data: SimpleImageData }) {
    this.data = data;
  }

  render(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'simple-image';

    const input = document.createElement('input');
    input.type = 'url';
    input.placeholder = 'Paste an image URL…';
    input.value = this.data?.url ?? '';

    const preview = document.createElement('img');
    preview.src = this.data?.url ?? '';
    preview.style.cssText = 'max-width:100%; display:block; margin-top:8px;';
    preview.hidden = !this.data?.url;

    input.addEventListener('input', () => {
      preview.src = input.value;
      preview.hidden = !input.value;
    });

    wrapper.appendChild(input);
    wrapper.appendChild(preview);
    return wrapper;
  }

  save(blockContent: HTMLDivElement): SimpleImageData {
    const input = blockContent.querySelector('input') as HTMLInputElement;
    const url = input?.value.trim() ?? '';

    try {
      new URL(url);
      return { url };
    } catch {
      return this.data;
    }
  }
}
