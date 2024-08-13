export const Banner: React.FC<{ title: string; sub: string }> = ({
  title,
  sub,
}) => {
  return (
    <section className="banner bread-c">
      <div className="container">
        <div className="row gy-4 gy-sm-0">
          <div className="col-12 col-sm-6">
            <div className="banner__content">
              <h1 className="banner__title display-4">{title}</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {sub}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="banner__thumb text-end">
              <img
                src="/assets/images/Hand holding pen-pana.svg"
                alt="image"
                style={{ width: "300px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
