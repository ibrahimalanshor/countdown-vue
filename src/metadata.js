import { reactive } from 'vue';

export default () => {
  const metadata = reactive({
    title: '',
    date: new Date(),
  });

  const parse = (data) => {
    return new Promise((resolve, reject) => {
      let parsed;

      try {
        parsed = JSON.parse(data);
      } catch (err) {
        reject('Parsing data failed');
      }

      if (typeof parsed !== 'object') {
        reject('Data is not object');
      }

      if (parsed === null) {
        reject('Data is empty');
      }

      if (!parsed.hasOwnProperty('title') && !parsed.hasOwnProperty('date')) {
        reject('Data is invalid');
      }

      resolve(parsed);
    });
  };

  const get = () => {
    return new Promise((resolve, reject) => {
      const data = localStorage.getItem('countdown');

      parse(data)
        .then((parsed) => {
          resolve({
            title: parsed.title,
            date: new Date(parsed.date),
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const set = () => {
    return new Promise((resolve, reject) => {
      get()
        .then(({ title, date }) => {
          metadata.title = title;
          metadata.date = date;

          resolve(metadata);
        })
        .catch(() => {
          (metadata.title = 'Countdown'),
            (metadata.date = new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            ));

          resolve(metadata);
        });
    });
  };

  const store = (data) =>
    localStorage.setItem('countdown', JSON.stringify(data));

  return {
    metadata,
    get,
    set,
    store,
  };
};
