import { Component, ChangeEvent } from "react";
import NewsDataService from "../../services/news.service";
import { Link } from "react-router-dom";
import INewsData from '../../types/news.type';

type Props = {};

type State = {
  news: Array<INewsData>,
  current: INewsData | null,
  currentIndex: number,
  searchTitle: string
};

export default class NewsList extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActive = this.setActive.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      news: [],
      current: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrieve();
  }

  onChangeSearchTitle(e: ChangeEvent<HTMLInputElement>) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieve() {
    NewsDataService.getAll()
      .then((response: any) => {
        this.setState({
          news: response.data
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieve();
    this.setState({
      current: null,
      currentIndex: -1
    });
  }

  setActive(news: INewsData, index: number) {
    this.setState({
      current: news,
      currentIndex: index
    });
  }

  removeAll() {
    NewsDataService.deleteAll()
      .then((response: any) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  searchTitle() {
    this.setState({
      current: null,
      currentIndex: -1
    });

    NewsDataService.findByTitle(this.state.searchTitle)
      .then((response: any) => {
        this.setState({
          news: response.data
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  render() {
    const { searchTitle, news, current, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>News List</h4>

          <ul className="list-group">
            {news &&
              news.map((news: INewsData, index: number) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActive(news, index)}
                  key={index}
                >
                  {news.title}
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAll}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {current ? (
            <div>
              <h4>News</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {current.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {current.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {current.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/news/" + current.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a News...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
